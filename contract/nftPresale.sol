//SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract UrbanPunks is ERC721Enumerable, Ownable {
    string _baseTokenURI;

    uint256 public _price = 0.01 ether;

    bool public _paused;

    uint256 public maxTokenIds = 200;

    uint256 public tokenIds;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract currently paused");
        _;
    }

    constructor(string memory baseURI) ERC721("UrbanPunks", "UBP") {
        _baseTokenURI = baseURI;
    }

    function mint(uint8 amount) public payable onlyWhenNotPaused {
        require(tokenIds + amount <= maxTokenIds, "Maximum tokens Ids reached");
        require(msg.value == _price * amount, "Price is 0.01 ethers");
        for (uint i = 0; i < amount; i++) {
            tokenIds += 1;
            _safeMint(msg.sender, tokenIds);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send the Ether");
    }

    receive() external payable {}

    fallback() external payable {}
}
