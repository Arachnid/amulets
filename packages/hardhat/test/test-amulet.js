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
    contract = await Contract.deploy('0x0000000000000000000000000000000000000000');
    await contract.deployed();
  });

  it("should mint amulets", async () => {
    const id = getTokenId(AMULET_1);
    await expect(contract.mint(accounts[0].address, id))
      .to.emit(contract, "TransferSingle")
      .withArgs(accounts[0].address, '0x0000000000000000000000000000000000000000', accounts[0].address, id.toString('hex'), 1);

    expect(await contract.isRevealed(id)).to.equal(false);
    const data = await contract.getData(id);
    expect(data[0]).to.equal(accounts[0].address);
    expect(data[1].toNumber()).to.equal(0);
    expect(data[2]).to.equal(0);
    expect(await contract.ownerOf(id)).to.equal(accounts[0].address);
    expect(await contract.balanceOf(accounts[0].address, id)).to.equal(1);
  });

  it("should reveal amulets", async () => {
    const id = getTokenId(AMULET_1);
    await (await contract.mint(accounts[0].address, id)).wait();
  
    const title = "common amulets, 3 of 3";
    const offset = "example.com";
    await expect(contract.reveal(title, AMULET_1, offset))
      .to.emit(contract, 'AmuletRevealed')
      .withArgs(id.toString('hex'), accounts[0].address, title, AMULET_1, offset);

    expect(await contract.isRevealed(id)).to.equal(true);
    const data = await contract.getData(id);
    expect(data[0]).to.equal(accounts[0].address); // owner
    expect(data[1].toNumber()).to.be.greaterThan(0); // blockRevealed
    expect(data[2]).to.equal(4); // Score
  });

  it("should transfer amulets", async () => {
    const id = getTokenId(AMULET_1);
    await (await contract.mint(accounts[0].address, id)).wait();

    await expect(contract.safeTransferFrom(accounts[0].address, accounts[1].address, id, 1, "0x"))
      .to.emit(contract, 'TransferSingle')
      .withArgs(accounts[0].address, accounts[0].address, accounts[1].address, id.toString('hex'), 1);

    expect(await contract.ownerOf(id)).to.equal(accounts[1].address);
    expect(await contract.balanceOf(accounts[0].address, id)).to.equal(0);
    expect(await contract.balanceOf(accounts[1].address, id)).to.equal(1);
  })
});
