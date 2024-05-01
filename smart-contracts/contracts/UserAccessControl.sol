// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract UserAccessControl is Ownable, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  /**
   * @dev Grants `DEFAULT_ADMIN_ROLE` to the account that deploys the contract.
   * Grants `MINTER_ROLE` to the account that deploys the contract.
   */
  constructor() Ownable(msg.sender) {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  /**
   * @dev Grants `MINTER_ROLE` to the specified user.
   * Can only be called by the contract owner.
   */
  function grantMinterRole(address user) public onlyOwner {
    grantRole(MINTER_ROLE, user);
  }

  /**
   * @dev Revokes `MINTER_ROLE` from the specified user.
   * Can only be called by the contract owner.
   */
  function revokeMinterRole(address user) public onlyOwner {
    revokeRole(MINTER_ROLE, user);
  }

  /**
   * @dev Test wheter use has a `MINTER_ROLE`.
   */
  function isMinter() public view returns (bool canActivate) {
    if (!hasRole(MINTER_ROLE, msg.sender)) return false;
    return true;
  }

  /**
   * @dev Get owner
   */
  function getOwner() public view returns (address) {
    return owner();
  }
}
