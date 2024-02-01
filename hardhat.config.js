require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/bOY9sPwzLLIyHZjwR2QQFX9AtruNz5Tz",
      accounts: [
        "6d90411b0d9cce9f4ba9f0d84f340d5f8d6408ef03ff030d01f4c9780217b183",
      ],
    },
    local: {
      url: "http://127.0.0.1:8545/",
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ],
    },
    polygon: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/ZRxL88ZcS-IFLKAZsdKZGulU6y_rQL-o",
      accounts: [
        "6d90411b0d9cce9f4ba9f0d84f340d5f8d6408ef03ff030d01f4c9780217b183",
      ],
    },
  },
};
