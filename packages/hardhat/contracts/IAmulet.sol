// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

interface IAmulet is IERC1155, IERC1155MetadataURI {
    event AmuletRevealed(uint256 indexed tokenId, address revealedBy, string title, string amulet, string offsetUrl);

    struct MintData {
        address owner;
        uint256 tokenId;
    }

    struct RevealData {
        string title;
        string amulet;
        string offsetURL;
    }

    struct MintAndRevealData {
        string title;
        string amulet;
        string offsetURL;
        address owner;
    }

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
     * @param data The ID and owner for the new token.
     */
    function mint(MintData calldata data) external;

    /**
     * @dev Mint new amulets.
     * @param data The IDs and amulets for the new tokens.
     */
    function mintAll(MintData[] calldata data) external;

    /**
     * @dev Reveals an amulet.
     * @param data The title, text, and offset URL for the amulet.
     */
    function reveal(RevealData calldata data) external;

    /**
     * @dev Reveals multiple amulets
     * @param data The titles, texts, and offset URLs for the amulets.
     */
    function revealAll(RevealData[] calldata data) external;

    /**
     * @dev Mint and reveal an amulet.
     * @param data The title, text, offset URL, and owner for the new amulet.
     */
    function mintAndReveal(MintAndRevealData calldata data) external;

    /**
     * @dev Mint and reveal amulets.
     * @param data The titles, texts, offset URLs, and owners for the new amulets.
     */
    function mintAndRevealAll(MintAndRevealData[] calldata data) external;

    /**
     * @dev Returns the Amulet's owner address, the block it was revealed in, and its score.
     */
    function getData(uint256 tokenId) external view returns(address owner, uint64 blockRevealed, uint32 score);
}
