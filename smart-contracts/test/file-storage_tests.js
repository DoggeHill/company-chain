const FileStorage = artifacts.require("FileStorage");

contract("FileStorage", function (accounts) {
  let fileStorage;
  const userAddress1 = accounts[0];
  const userAddress2 = accounts[1];
  const authorAddress = accounts[2];
  const fileName = "example.txt";
  const uploadDate = "2022-04-29";

  beforeEach(async function () {
    fileStorage = await FileStorage.new();
  });

  it("should store CID and user address correctly", async function () {
    const cid = "Qm12345";
    await fileStorage.storeCIDAndUserAddress(cid, userAddress1, authorAddress, fileName, uploadDate);
    const userFiles = await fileStorage.getUserFiles(userAddress1);
    assert.equal(userFiles.length, 1, "File not stored correctly");
    assert.equal(userFiles[0].cid, cid, "CID not stored correctly");
    assert.equal(userFiles[0].userAddress, userAddress1, "User address not stored correctly");
    assert.equal(userFiles[0].authorAddress, authorAddress, "Author address not stored correctly");
    assert.equal(userFiles[0].fileName, fileName, "File name not stored correctly");
    assert.equal(userFiles[0].uploadDate, uploadDate, "Upload date not stored correctly");
  });

  it("should return user's files correctly", async function () {
    const cid1 = "Qm12345";
    const cid2 = "Qm67890";
    await fileStorage.storeCIDAndUserAddress(cid1, userAddress1, authorAddress, fileName, uploadDate);
    await fileStorage.storeCIDAndUserAddress(cid2, userAddress1, authorAddress, fileName, uploadDate);
    const userFiles = await fileStorage.getUserFiles(userAddress1);
    assert.equal(userFiles.length, 2, "Files not returned correctly");
    assert.equal(userFiles[0].cid, cid1, "First CID not returned correctly");
    assert.equal(userFiles[1].cid, cid2, "Second CID not returned correctly");
  });

  it("should return all files correctly", async function () {
    const cid1 = "Qm12345";
    const cid2 = "Qm67890";
    await fileStorage.storeCIDAndUserAddress(cid1, userAddress1, authorAddress, fileName, uploadDate);
    await fileStorage.storeCIDAndUserAddress(cid2, userAddress2, authorAddress, fileName, uploadDate);
    const allFiles = await fileStorage.getAllFiles();
    assert.equal(allFiles.length, 2, "All files not returned correctly");
    assert.equal(allFiles[0][0].cid, cid1, "First CID not returned correctly");
    assert.equal(allFiles[1][0].cid, cid2, "Second CID not returned correctly");
  });

  it("should return the number of users correctly", async function () {
    const numberOfUsersBefore = await fileStorage.getNumberOfUsers();
    assert.equal(numberOfUsersBefore, 0, "Number of users not returned correctly before storing files");

    const cid = "Qm12345";
    await fileStorage.storeCIDAndUserAddress(cid, userAddress1, authorAddress, fileName, uploadDate);

    const numberOfUsersAfter = await fileStorage.getNumberOfUsers();
    assert.equal(numberOfUsersAfter, 1, "Number of users not returned correctly after storing files");
  });

  it("should return user address at index correctly", async function () {
    await fileStorage.storeCIDAndUserAddress("Qm12345", userAddress1, authorAddress, fileName, uploadDate);
    await fileStorage.storeCIDAndUserAddress("Qm67890", userAddress2, authorAddress, fileName, uploadDate);
    const userAddressAtIndex0 = await fileStorage.getUserAtIndex(0);
    const userAddressAtIndex1 = await fileStorage.getUserAtIndex(1);
    assert.equal(userAddressAtIndex0, userAddress1, "User address at index 0 not returned correctly");
    assert.equal(userAddressAtIndex1, userAddress2, "User address at index 1 not returned correctly");
  });
});