var SchoolLedger = artifacts.require("./SchoolLedger.sol");

module.exports = function(deployer) {
  deployer.deploy(SchoolLedger);
};
