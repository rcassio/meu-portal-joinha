require("@nomicfoundation/hardhat-toolbox");

/** 
 * @type import('hardhat/config').HardhatUserConfig 
 * */
module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/An3dT1_4ZvSBPdWD0TlPTYsEzIlVHT8z",
      accounts: ["056ae74718f9bc1500664804b2ebad9c6f74c668e61691cd7dcf4fd53efd2b26"],
    },
  },
};
