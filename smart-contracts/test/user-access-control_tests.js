const UserAccessControl = artifacts.require("UserAccessControl");

contract('UserAccessControl', function (accounts) {
  let userAccessControl;
  const owner = accounts[0];
  const otherUser = accounts[1];

  beforeEach(async function () {
    userAccessControl = await UserAccessControl.new({ from: owner });
  });

  it('should grant MINTER_ROLE to the deployer', async function () {
    const hasRole = await userAccessControl.hasRole(await userAccessControl.MINTER_ROLE(), owner);
    assert.equal(hasRole, true, 'MINTER_ROLE not granted to deployer');
  });

  it('should grant MINTER_ROLE to another user', async function () {
    await userAccessControl.grantMinterRole(otherUser, { from: owner });
    const hasRole = await userAccessControl.hasRole(await userAccessControl.MINTER_ROLE(), otherUser);
    assert.equal(hasRole, true, 'MINTER_ROLE not granted to the specified user');
  });

  it('should revoke MINTER_ROLE from a user', async function () {
    await userAccessControl.grantMinterRole(otherUser, { from: owner });
    await userAccessControl.revokeMinterRole(otherUser, { from: owner });
    const hasRole = await userAccessControl.hasRole(await userAccessControl.MINTER_ROLE(), otherUser);
    assert.equal(hasRole, false, 'MINTER_ROLE not revoked from the specified user');
  });

  it('should check if the caller has MINTER_ROLE', async function () {
    const isMinter = await userAccessControl.isMinter({ from: owner });
    assert.equal(isMinter, true, 'Caller does not have MINTER_ROLE');
  });

  it('should return the owner', async function () {
    const contractOwner = await userAccessControl.getOwner();
    assert.equal(contractOwner, owner, 'Owner not returned correctly');
  });
});
