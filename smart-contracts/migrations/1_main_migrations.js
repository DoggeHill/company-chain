// const { artifacts } = require("hardhat");

// const Math = artifacts.require("math");
// const SignedMath = artifacts.require("signedMath");
// const SQLHelpers = artifacts.require("SQLHelpers");
// const Strings = artifacts.require("Strings");
// const GreeterContract = artifacts.require("Greeter");
// const TableContract = artifacts.require("Table");
// const TableLandDeployments = artifacts.require("TablelandDeployments");
// const Tickets = artifacts.require("Tickets");

const UserAccessControl = artifacts.require("UserAccessControl")
const FileUpload = artifacts.require("FileStorage")

module.exports = function(deployer) {
    // deployer.deploy(Math);
    // deployer.deploy(SignedMath);
    // deployer.deploy(SQLHelpers);
    // deployer.deploy(Strings);
    // deployer.deploy(GreeterContract);
    // deployer.deploy(TableLandDeployments);
    // deployer.link(Math ,TableContract );
    // deployer.link(SignedMath ,TableContract );
    // deployer.link(SQLHelpers ,TableContract );
    // deployer.link(Strings ,TableContract );
    // deployer.link(<TableLandDeplo></TableLandDeplo>yments ,TableContract );
    // deployer.deploy(TableContract);
    // deployer.deploy(Tickets);
    
    deployer.deploy(UserAccessControl);
    deployer.deploy(FileUpload);
};

