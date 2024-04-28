// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract FileStorage {
    struct FileData {
        string cid;
        address userAddress;
    }

    mapping(address => FileData[]) public userFiles;
    address[] public users; // Array to store user addresses

    function storeCIDAndUserAddress(string memory cid, address userAddress) public {
        userFiles[userAddress].push(FileData(cid, userAddress));
        if (userFiles[userAddress].length == 1) {
            users.push(userAddress); // Add user address to the array if it's the first file for that user
        }
    }

    function getUserFiles(address userAddress) public view returns (FileData[] memory) {
        return userFiles[userAddress];
    }

    function getAllFiles() public view returns (FileData[][] memory) {
        uint256 totalUsers = getNumberOfUsers();
        FileData[][] memory allFiles = new FileData[][](totalUsers);

        for (uint256 i = 0; i < totalUsers; i++) {
            allFiles[i] = userFiles[getUserAtIndex(i)];
        }

        return allFiles;
    }

    function getNumberOfUsers() public view returns (uint256) {
        return users.length; // Return the length of the users array
    }

    function getUserAtIndex(uint256 index) public view returns (address) {
        require(index < users.length, "Index out of bounds"); // Ensure index is within bounds
        return users[index];
    }
}