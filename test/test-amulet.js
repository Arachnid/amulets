const { expect } = require("chai");
const { ethers } = require("hardhat");

AMULET_1 = "DON'T WORRY.";
AMULET_2 = "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*";

function hashAmulet(a) {
  return ethers.utils.sha256(Buffer.from(a));
}

describe("Amulet", function() {
  let accounts;
  let contract;

  before(async () => {
    accounts = await ethers.getSigners();
  });
  
  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Amulet");
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it("should mint amulets", async () => {
    const hash = hashAmulet(AMULET_1);
    const tx = await contract.mint(accounts[0].address, hash);
    const receipt = await tx.wait();
    console.log(`Mint: ${receipt.gasUsed} gas`);

    expect(receipt.events.length).to.equal(1);
    expect(receipt.events[0].event).to.equal('Transfer');
    expect(receipt.events[0].args[0]).to.equal('0x0000000000000000000000000000000000000000');
    expect(receipt.events[0].args[1]).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(receipt.events[0].args[2].toHexString()).to.equal(hash.toString('hex'));

    expect(await contract.score(hash)).to.equal(4);
    expect(await contract.isRevealed(hash)).to.equal(false);
    const data = await contract.getData(hash);
    expect(data[0]).to.equal(accounts[0].address);
    expect(data[1].toNumber()).to.equal(0);
  });

  it("should reveal amulets", async () => {
    const hash = hashAmulet(AMULET_1);
    await (await contract.mint(accounts[0].address, hash)).wait();
  
    const title = "common amulets, 3 of 3";
    const offset = "example.com";
    const tx = await contract.reveal(title, AMULET_1, offset);
    const receipt = await tx.wait();
    console.log(`Reveal: ${receipt.gasUsed} gas`);

    expect(receipt.events.length).to.equal(1);
    expect(receipt.events[0].event).to.equal('AmuletRevealed');
    expect(receipt.events[0].args[0].toHexString()).to.equal(hash.toString('hex'));
    expect(receipt.events[0].args.slice(1)).to.deep.equal([accounts[0].address, title, AMULET_1, offset]);

    expect(await contract.isRevealed(hash)).to.equal(true);
    const data = await contract.getData(hash);
    expect(data[0]).to.equal(accounts[0].address);
    expect(data[1].toNumber()).to.equal(receipt.blockNumber);
  });
});
