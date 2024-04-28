// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.24 and less than 0.9.0
pragma solidity >=0.8.10 <=0.8.25;

contract HelloWorld {
    string public _greet = "Hello World!";

    function greet() public view returns (string memory) {
        return _greet;
    }
}
