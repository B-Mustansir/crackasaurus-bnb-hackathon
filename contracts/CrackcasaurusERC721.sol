// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Crackasaurus is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Pausable,
    AccessControl
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant WHITELIST_MANAGER_ROLE =
        keccak256("WHITELIST_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 private _nextTokenId;
    mapping(address => bool) public _whitelisted;
    string private _uri;

    constructor(string memory _ur) ERC721("Crackasaurus", "CRACKA") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(WHITELIST_MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _uri = _ur;
    }

    modifier onlyWhitelisted() {
        require(_whitelisted[msg.sender], "Caller is not whitelisted");
        _;
    }

    function addWhitelist(
        address user
    ) external onlyRole(WHITELIST_MANAGER_ROLE) {
        _whitelisted[user] = true;
    }

    function removeWhitelist(
        address user
    ) external onlyRole(WHITELIST_MANAGER_ROLE) {
        _whitelisted[user] = false;
    }

    function _generateTokenURI(
        uint256 tokenId
    ) internal view returns (string memory) {
        return
            string(abi.encodePacked(_uri, Strings.toString(tokenId), ".json"));
    }

    function mint() public onlyWhitelisted {
        address to = msg.sender;
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _generateTokenURI(tokenId));
        // _whitelisted[to] = false;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function setURI(string memory uri) public onlyRole(MINTER_ROLE) {
        _uri = uri;
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(
        address to,
        uint256 quantity
    ) public onlyRole(MINTER_ROLE) {
        require(quantity > 0, "Quantity must be greater than zero");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(to, tokenId);
            _setTokenURI(tokenId, _generateTokenURI(tokenId));
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}