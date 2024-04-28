// SPDX-License-Identifier: MIT 
pragma solidity >=0.8.10 <= 0.8.25;

contract Greeter {
    string private _greeting = "Hello, World!";
    address private _owner;

    constructor() {
        _owner = msg.sender;
    }

    function greet() external view returns(string memory) { 
        return _greeting;
    }
    
    function setGreeting(string calldata greeting) external onlyOwner {
         _greeting = greeting;
    }

    function owner() external view returns(address) { 
        return _owner;
    }

    modifier onlyOwner() { require(
        msg.sender == _owner,
        "Ownable: caller is not the owner"
        );
        _; 
    }
}