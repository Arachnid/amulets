// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin's ERC721 implementation, with changes for gas-efficiency.

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IAmulet.sol";
import "./ProxyRegistryWhitelist.sol";

/**
 * @dev Implementation of https://eips.ethereum.org/EIPS/eip-721[ERC721] Non-Fungible Token Standard, including
 * the Metadata extension, but not including the Enumerable extension, which is available separately as
 * {ERC721Enumerable}.
 */
contract Amulet is IAmulet, ERC165, ProxyRegistryWhitelist {
    using Address for address;

    // Mapping from token ID to token data
    // Values are packed in the form:
    // [score (32 bits)][blockRevealed (64 bits)][owner (160 bits)]
    // This is equivalent to the following Solidity structure,
    // but saves us about 4200 gas on mint, 3600 gas on reveal,
    // and 140 gas on transfer.
    // struct Token {
    //   uint32 score;
    //   uint64 blockRevealed;
    //   address owner;
    // }
    mapping (uint256 => uint256) private _tokens;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    constructor (address proxyRegistryAddress, uint256[] memory premineIDs, uint256[] memory premineValues) ProxyRegistryWhitelist(proxyRegistryAddress) {
        // Mint 'premined' token IDs.
        require(premineIDs.length == premineValues.length);
        for(uint i = 0; i < premineIDs.length; i++) {
            _tokens[premineIDs[i]] = premineValues[i];
            emit TransferSingle(msg.sender, address(0), address(uint160(premineValues[i])), premineIDs[i], 1);
        }
    }

    /**************************************************************************
     * Opensea-specific methods
     *************************************************************************/

    function contractURI() external pure returns (string memory) {
        return "https://at.amulet.garden/contract.json";
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual returns (string memory) {
        return "Amulets";
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual returns (string memory) {
        return "AMULET";
    }

    /**************************************************************************
     * ERC721 methods
     *************************************************************************/

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1155).interfaceId
            || interfaceId == type(IERC1155MetadataURI).interfaceId
            || super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function uri(uint256 /*tokenId*/) public view virtual override returns (string memory) {
        return "https://at.amulet.garden/token/{id}.json";
    }

    /**
     * @dev See {IERC1155-balanceOf}.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) public view virtual override returns (uint256) {
        require(account != address(0), "ERC1155: balance query for the zero address");
        (address owner,,) = getData(id);
        if(owner == account) {
            return 1;
        }
        return 0;
    }

    /**
     * @dev See {IERC1155-balanceOfBatch}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory ids
    )
        public
        view
        virtual
        override
        returns (uint256[] memory)
    {
        require(accounts.length == ids.length, "ERC1155: accounts and ids length mismatch");

        uint256[] memory batchBalances = new uint256[](accounts.length);

        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }

        return batchBalances;
    }

    /**
     * @dev See {IERC1155-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(msg.sender != operator, "ERC1155: setting approval status for self");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev See {IERC1155-isApprovedForAll}.
     */
    function isApprovedForAll(address account, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[account][operator] || isProxyForOwner(account, operator);
    }

    /**
     * @dev See {IERC1155-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    )
        public
        virtual
        override
    {
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );

        (address oldOwner, uint64 blockRevealed, uint32 score) = getData(id);
        require(amount == 1 && oldOwner == from, "ERC1155: Insufficient balance for transfer");
        setData(id, to, blockRevealed, score);

        emit TransferSingle(msg.sender, from, to, id, amount);

        _doSafeTransferAcceptanceCheck(msg.sender, from, to, id, amount, data);
    }

    /**
     * @dev See {IERC1155-safeBatchTransferFrom}.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        public
        virtual
        override
    {
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: transfer caller is not owner nor approved"
        );

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];

            (address oldOwner, uint64 blockRevealed, uint32 score) = getData(id);
            require(amount == 1 && oldOwner == from, "ERC1155: insufficient balance for transfer");
            setData(id, to, blockRevealed, score);
        }

        emit TransferBatch(msg.sender, from, to, ids, amounts);

        _doSafeBatchTransferAcceptanceCheck(msg.sender, from, to, ids, amounts, data);
    }

    /**************************************************************************
     * Amulet-specific methods
     *************************************************************************/

    /**
     * @dev Returns the owner of the token with id `id`.
     */
    function ownerOf(uint256 id) external override view returns(address) {
        (address owner,,) = getData(id);
        return owner;
    }


    /**
     * @dev Returns the score of an amulet.
     *      0-3: Not an amulet
     *      4: common
     *      5: uncommon
     *      6: rare
     *      7: epic
     *      8: legendary
     *      9: mythic
     *      10+: beyond mythic
     */
    function getScore(string calldata amulet) public override pure returns(uint32) {
        uint256 hash = uint256(sha256(bytes(amulet)));
        uint maxlen = 0;
        uint len = 0;
        for(;hash > 0; hash >>= 4) {
            if(hash & 0xF == 8) {
                len += 1;
                if(len > maxlen) {
                    maxlen = len;
                }
            } else {
                len = 0;
            }
        }
        return uint32(maxlen);        
    }

    /**
     * @dev Returns true if an amulet has been revealed.
     *      If this returns false, we cannot be sure the amulet even exists! Don't accept an amulet from someone
     *      if it's not revealed and they won't show you the text of the amulet.
     */
    function isRevealed(uint256 tokenId) external override view returns(bool) {
        (address owner, uint64 blockRevealed,) = getData(tokenId);
        require(owner != address(0), "ERC721: isRevealed query for nonexistent token");
        return blockRevealed > 0;
    }
    
    /**
     * @dev Mint a new amulet.
     * @param owner The owner for the new amulet.
     * @param tokenId The tokenId, which is the sha256 hash of the text of the amulet.
     */
    function mint(address owner, uint256 tokenId) external override {
        _mint(owner, tokenId);
    }

    /**
     * @dev Reveals an amulet.
     * @param title A title for the amulet.
     * @param amulet The text of the amulet. An NFT with ID equal to the sha256 of the text must already exist.
     * @param offsetURL The URL of a certification of a purchased carbon offset of at least 1T.
     */
    function reveal(string calldata title, string calldata amulet, string calldata offsetURL) external override {
        require(bytes(amulet).length <= 64, "Amulet: Too long");
        uint256 tokenId = uint256(keccak256(bytes(amulet)));
        (address owner, uint64 blockRevealed, uint32 score) = getData(tokenId);
        require(
            owner == address(0) || owner == msg.sender || isApprovedForAll(owner, msg.sender),
            "Amulet: reveal caller is not owner nor approved"
        );
        require(blockRevealed == 0, "Amulet: Already revealed");

        score = getScore(amulet);
        require(score >= 4, "Amulet: Score too low");

        if(owner == address(0)) {
            owner = msg.sender;
        }

        setData(tokenId, owner, uint64(block.number), score);
        emit AmuletRevealed(tokenId, msg.sender, title, amulet, offsetURL);
    }

    /**
     * @dev Returns the Amulet's owner address, the block it was revealed in, and its score.
     */
    function getData(uint256 tokenId) public override view returns(address owner, uint64 blockRevealed, uint32 score) {
        uint256 t = _tokens[tokenId];
        owner = address(uint160(t));
        blockRevealed = uint64(t >> 160);
        score = uint32(t >> 224);
    }

    /**
     * @dev Sets the amulet's owner address, reveal block, and score.
     */
    function setData(uint256 tokenId, address owner, uint64 blockRevealed, uint32 score) internal {
        _tokens[tokenId] = uint256(uint160(owner)) | (uint256(blockRevealed) << 160) | (uint256(score) << 224);
    }

    /**************************************************************************
     * Internal/private methods
     *************************************************************************/

    /**
     * @dev Creates a token of token type `id`, and assigns it to `account`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - If `account` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function _mint(address to, uint256 id) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");
        require(_tokens[id] == 0, "ERC1155: mint of existing token");

        _tokens[id] = uint256(uint160(to));
        emit TransferSingle(msg.sender, address(0), to, id, 1);

        _doSafeTransferAcceptanceCheck(msg.sender, address(0), to, id, 1, "");
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {_mint}.
     *
     * Requirements:
     *
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function _mintBatch(address to, uint256[] memory ids) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");

        uint256[] memory amounts = new uint256[](ids.length);
        for (uint i = 0; i < ids.length; i++) {
            require(_tokens[ids[i]] == 0, "ERC1155: mint of existing token");
            _tokens[ids[i]] = uint256(uint160(to));
            amounts[i] = 1;
        }

        emit TransferBatch(msg.sender, address(0), to, ids, amounts);

        _doSafeBatchTransferAcceptanceCheck(msg.sender, address(0), to, ids, amounts, "");
    }

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    )
        private
    {
        if (to.isContract()) {
            try IERC1155Receiver(to).onERC1155Received(operator, from, id, amount, data) returns (bytes4 response) {
                if (response != IERC1155Receiver(to).onERC1155Received.selector) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }

    function _doSafeBatchTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        private
    {
        if (to.isContract()) {
            try IERC1155Receiver(to).onERC1155BatchReceived(operator, from, ids, amounts, data) returns (bytes4 response) {
                if (response != IERC1155Receiver(to).onERC1155BatchReceived.selector) {
                    revert("ERC1155: ERC1155Receiver rejected tokens");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("ERC1155: transfer to non ERC1155Receiver implementer");
            }
        }
    }
}
