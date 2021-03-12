const { expect } = require("chai");
const { ethers } = require("hardhat");

AMULET_1 = "DON'T WORRY.";
AMULET_2 = "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*";

function getTokenId(a) {
  return ethers.utils.keccak256(Buffer.from(a));
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
    const id = getTokenId(AMULET_1);
    const tx = await contract.mint(accounts[0].address, id);
    const receipt = await tx.wait();
    console.log(`Mint: ${receipt.gasUsed} gas`);

    expect(receipt.events.length).to.equal(1);
    expect(receipt.events[0].event).to.equal('Transfer');
    expect(receipt.events[0].args[0]).to.equal('0x0000000000000000000000000000000000000000');
    expect(receipt.events[0].args[1]).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(receipt.events[0].args[2].toHexString()).to.equal(id.toString('hex'));

    expect(await contract.isRevealed(id)).to.equal(false);
    const data = await contract.getData(id);
    expect(data[0]).to.equal(accounts[0].address);
    expect(data[1].toNumber()).to.equal(0);
    expect(data[2]).to.equal(0);
    expect(await contract.ownerOf(id)).to.equal(accounts[0].address);
  });

  it("should reveal amulets", async () => {
    const id = getTokenId(AMULET_1);
    await (await contract.mint(accounts[0].address, id)).wait();
  
    const title = "common amulets, 3 of 3";
    const offset = "example.com";
    const tx = await contract.reveal(title, AMULET_1, offset);
    const receipt = await tx.wait();
    console.log(`Reveal: ${receipt.gasUsed} gas`);

    expect(receipt.events.length).to.equal(1);
    expect(receipt.events[0].event).to.equal('AmuletRevealed');
    expect(receipt.events[0].args[0].toHexString()).to.equal(id.toString('hex'));
    expect(receipt.events[0].args.slice(1)).to.deep.equal([accounts[0].address, title, AMULET_1, offset]);

    expect(await contract.isRevealed(id)).to.equal(true);
    const data = await contract.getData(id);
    expect(data[0]).to.equal(accounts[0].address); // owner
    expect(data[1].toNumber()).to.equal(receipt.blockNumber); // blockRevealed
    expect(data[2]).to.equal(4); // Score
  });

  it("should transfer amulets", async () => {
    const id = getTokenId(AMULET_1);
    await (await contract.mint(accounts[0].address, id)).wait();

    const tx = await contract.transferFrom(accounts[0].address, accounts[1].address, id);
    const receipt = await tx.wait();
    console.log(`Transfer: ${receipt.gasUsed} gas`);

    expect(await contract.ownerOf(id)).to.equal(accounts[1].address);
  })
});
