const UserAccessControl = artifacts.require("UserAccessControl")
const FileUpload = artifacts.require("FileStorage")

module.exports = function(deployer) {
    deployer.deploy(UserAccessControl);
    deployer.deploy(FileUpload);
};