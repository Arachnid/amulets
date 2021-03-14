// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface IAmulet is IERC1155, IERC1155MetadataURI {
    event AmuletRevealed(uint256 indexed tokenId, address revealedBy, string title, string amulet, string offsetUrl);

    /**
     * @dev Returns the owner of the token with id `id`.
     */
    function ownerOf(uint256 id) external view returns(address);

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
    function getScore(string calldata amulet) external pure returns(uint32);

    /**
     * @dev Returns true if an amulet has been revealed.
     *      If this returns false, we cannot be sure the amulet even exists! Don't accept an amulet from someone
     *      if it's not revealed and they won't show you the text of the amulet.
     */
    function isRevealed(uint256 tokenId) external view returns(bool);

    /**
     * @dev Mint a new amulet.
     * @param owner The owner for the new amulet.
     * @param tokenId The tokenId, which is the sha256 hash of the text of the amulet.
     */
    function mint(address owner, uint256 tokenId) external;

    /**
     * @dev Reveals an amulet.
     * @param title A title for the amulet.
     * @param amulet The text of the amulet. An NFT with ID equal to the sha256 of the text must already exist.
     * @param offsetURL The URL of a certification of a purchased carbon offset of at least 1T.
     */
    function reveal(string calldata title, string calldata amulet, string calldata offsetURL) external;
    
    /**
     * @dev Returns the Amulet's owner address, the block it was revealed in, and its score.
     */
    function getData(uint256 tokenId) external view returns(address owner, uint64 blockRevealed, uint32 score);
}
