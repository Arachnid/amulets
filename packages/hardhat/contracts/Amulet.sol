// SPDX-License-Identifier: MIT
// Derived from OpenZeppelin's ERC721 implementation, with changes for gas-efficiency.

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
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
    using Strings for uint256;

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

    // Mapping from token ID to approved address
    mapping (uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping (address => mapping (address => bool)) private _operatorApprovals;

    constructor (address proxyRegistryAddress) ProxyRegistryWhitelist(proxyRegistryAddress) { }

    /**************************************************************************
     * Opensea-specific methods
     *************************************************************************/
    function contractURI() external pure returns (string memory) {
        return "https://at.amulet.garden/contract.json";
    }

    /**************************************************************************
     * ERC721 methods
     *************************************************************************/

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC721).interfaceId
            || interfaceId == type(IERC721Metadata).interfaceId
            || super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721-balanceOf}.
     */
    function balanceOf(address) public view virtual override returns (uint256) {
        revert("Not implemented");
    }

    /**
     * @dev See {IERC721-ownerOf}.
     */
    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        address owner = address(uint160(_tokens[tokenId]));
        require(owner != address(0), "ERC721: owner query for nonexistent token");
        return owner;
    }

    /**
     * @dev See {IERC721Metadata-name}.
     */
    function name() public view virtual override returns (string memory) {
        return "Amulet";
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function symbol() public view virtual override returns (string memory) {
        return "AMULET";
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked("https://at.amulet.garden/token/", tokenId.toHexString(), ".json"));
    }

    /**
     * @dev See {IERC721-approve}.
     */
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");

        require(msg.sender== owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev See {IERC721-getApproved}.
     */
    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev See {IERC721-setApprovalForAll}.
     */
    function setApprovalForAll(address operator, bool approved) public virtual override {
        require(operator != msg.sender, "ERC721: approve to caller");

        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    /**
     * @dev See {IERC721-isApprovedForAll}.
     */
    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return _operatorApprovals[owner][operator] || isProxyForOwner(owner, operator);
    }

    /**
     * @dev See {IERC721-transferFrom}.
     */
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");

        _transfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }
    

    /**************************************************************************
     * Amulet-specific methods
     *************************************************************************/

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
        uint32 maxlen = 0;
        uint32 len = 0;
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
        return maxlen;        
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
        _safeMint(owner, tokenId);
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

        require(blockRevealed == 0, "Amulet: Already revealed");
        score = getScore(amulet);
        require(score >= 4, "Amulet: Score too low");

        setData(tokenId, owner, uint64(block.number), score);
        emit AmuletRevealed(tokenId, msg.sender, title, amulet, offsetURL);
    }

    /**
     * @dev Returns the Amulet's owner address, the block it was revealed in, and its score.
     */
    function getData(uint256 tokenId) public override view returns(address owner, uint64 blockRevealed, uint32 score) {
        uint256 t = _tokens[tokenId];
        owner = address(uint160(t));
        require(owner != address(0), "ERC721: getData query for nonexistent token");
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
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * `_data` is additional data, it has no specified format and it is sent in call to `to`.
     *
     * This internal function is equivalent to {safeTransferFrom}, and can be used to e.g.
     * implement alternative mechanisms to perform token transfer, such as signature-based.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory _data) internal virtual {
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _tokens[tokenId] & 0x00ffffffffffffffffffffffffffffffffffffffff != 0;
    }

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }

    /**
     * @dev Safely mints `tokenId` and transfers it to `to`.
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function _safeMint(address to, uint256 tokenId) internal virtual {
        _safeMint(to, tokenId, "");
    }

    /**
     * @dev Same as {xref-ERC721-_safeMint-address-uint256-}[`_safeMint`], with an additional `data` parameter which is
     * forwarded in {IERC721Receiver-onERC721Received} to contract recipients.
     */
    function _safeMint(address to, uint256 tokenId, bytes memory _data) internal virtual {
        _mint(to, tokenId);
        require(_checkOnERC721Received(address(0), to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    /**
     * @dev Mints `tokenId` and transfers it to `to`.
     *
     * WARNING: Usage of this method is discouraged, use {_safeMint} whenever possible
     *
     * Requirements:
     *
     * - `tokenId` must not exist.
     * - `to` cannot be the zero address.
     *
     * Emits a {Transfer} event.
     */
    function _mint(address to, uint256 tokenId) internal virtual {
        require(to != address(0), "ERC721: mint to the zero address");

        require(_tokens[tokenId] == 0, "ERC721: token already minted");
        _tokens[tokenId] = uint256(uint160(to));

        emit Transfer(address(0), to, tokenId);
    }

    /**
     * @dev Transfers `tokenId` from `from` to `to`.
     *  As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     *
     * Emits a {Transfer} event.
     */
    function _transfer(address from, address to, uint256 tokenId) internal virtual {
        require(ownerOf(tokenId) == from, "ERC721: transfer of token that is not own");
        require(to != address(0), "ERC721: transfer to the zero address");

        // Clear approvals from the previous owner
        _approve(address(0), tokenId);

        _tokens[tokenId] = (_tokens[tokenId] & 0xffffffffffffffffffffffff0000000000000000000000000000000000000000) | uint160(to);

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Approve `to` to operate on `tokenId`
     *
     * Emits a {Approval} event.
     */
    function _approve(address to, uint256 tokenId) internal virtual {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

    /**
     * @dev Internal function to invoke {IERC721Receiver-onERC721Received} on a target address.
     * The call is not executed if the target address is not a contract.
     *
     * @param from address representing the previous owner of the given token ID
     * @param to target address that will receive the tokens
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes optional data to send along with the call
     * @return bool whether the call correctly returned the expected magic value
     */
    function _checkOnERC721Received(address from, address to, uint256 tokenId, bytes memory _data)
        private returns (bool)
    {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver(to).onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    // solhint-disable-next-line no-inline-assembly
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
}
