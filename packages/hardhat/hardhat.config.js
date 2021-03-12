const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");

function getTokenId(a) {
  return ethers.utils.keccak256(Buffer.from(a));
}

AMULETS = ["DON'T WORRY.", "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*"];

task("deploy", "Deploy the contracts")
  .addOptionalParam("test", "Add test amulets", false, types.boolean)
  .setAction(async ({test}) => {
    const accounts = await ethers.getSigners();
    const Amulet = await ethers.getContractFactory("Amulet");
    const contract = await Amulet.deploy();
    console.log("Amulet deployed to:", contract.address);
    if(test) {
      amulets = AMULETS.map((a) => [getTokenId(a), a])
      for(let i = 0; i < amulets.length; i++) {
        const [id, amulet] = amulets[i];
        await contract.mint(accounts[0].address, id);
        if(i < amulets.length - 1) {
          await contract.reveal("Test amulet", amulet, "http://example.com/");
        }
      }
      console.log(amulets);
    }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    test: {
      url: "http://localhost:8545/"
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
  }
};

