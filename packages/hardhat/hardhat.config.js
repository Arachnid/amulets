const fs = require("fs");
const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

function getTokenId(a) {
  return ethers.utils.keccak256(Buffer.from(a));
}

AMULETS = ["DON'T WORRY.", "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*"];

task("deploy", "Deploy the contracts").setAction(async () => {
    const accounts = await ethers.getSigners();
    const Amulet = await ethers.getContractFactory("Amulet");
    const contract = await Amulet.deploy("0x0000000000000000000000000000000000000000", [], []);
    console.log("Amulet deployed to:", contract.address);
    fs.writeFileSync(`artifacts/Amulet.address`, contract.address);
});

task("mint", "Mint sample amulets")
  .addOptionalParam("owner", "Owner address", "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1")
  // .addOptionalParam("owner", "Owner address", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
  .setAction(async ({owner}) => {
    const accounts = await ethers.getSigners();
    await accounts[0].sendTransaction({to: owner, value: ethers.BigNumber.from('1000000000000000000')});
    const Amulet = await ethers.getContractFactory("Amulet");
    const contract = await Amulet.attach(fs.readFileSync('artifacts/Amulet.address', {encoding: 'utf-8'}));
    amulets = AMULETS.map((a) => [getTokenId(a), a])
    for(let i = 0; i < amulets.length; i++) {
      const [id, amulet] = amulets[i];
      await contract.mint(owner, id);
      if(i < amulets.length - 1) {
        await contract.reveal("Test amulet", amulet, "http://example.com/");
      }
    }
    console.log(amulets);
  });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    test: {
      url: "http://localhost:9545/"
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/6f00acf9331b46c482e81341d0e81e99",
      accounts: process.env['PRIVATE_KEY'] && [process.env["PRIVATE_KEY"]],
      gasPrice: 100000000000
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/6f00acf9331b46c482e81341d0e81e99",
      accounts: process.env['PRIVATE_KEY'] && [process.env["PRIVATE_KEY"]],
    }
  },
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000,
      }
    }
  },
  etherscan: {
    apiKey: 'NFCYZHBU2Z9ESKNY6IJS6QK9QHH4ECI2GS'
  }
};

