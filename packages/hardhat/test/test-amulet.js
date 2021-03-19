const { expect } = require("chai");
const { ethers } = require("hardhat");

AMULET_1 = "DON'T WORRY.";
AMULET_2 = "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*";
AMULET_3 = "this amulet is a simple token which proves my love's truth";

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
    contract = await Contract.deploy('0x0000000000000000000000000000000000000000', [getTokenId(AMULET_3)], [accounts[0].address]);
    await contract.deployed();
  });

  it("should mint premined tokens", async () => {
    const id = getTokenId(AMULET_3);
    const data = await contract.getData(id);
    expect(data[0]).to.equal(accounts[0].address);
    expect(data[1].toNumber()).to.equal(0);
    expect(data[2]).to.equal(0);
  });

  it("should mint amulets", async () => {
    const id = getTokenId(AMULET_1);
    const tx = contract.mint(accounts[0].address, id);
    await expect(tx).to.emit(contract, "TransferSingle")
      .withArgs(accounts[0].address, '0x0000000000000000000000000000000000000000', accounts[0].address, id.toString('hex'), 1);
    const receipt = await (await tx).wait();
    console.log(`Mint: ${receipt.gasUsed} gas`);

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
    const tx = contract.reveal(title, AMULET_1, offset);
    await expect(tx).to.emit(contract, 'AmuletRevealed')
      .withArgs(id.toString('hex'), accounts[0].address, title, AMULET_1, offset);
    const receipt = await (await tx).wait();
    console.log(`Reveal: ${receipt.gasUsed} gas`);

    expect(await contract.isRevealed(id)).to.equal(true);
    const data = await contract.getData(id);
    expect(data[0]).to.equal(accounts[0].address); // owner
    expect(data[1].toNumber()).to.be.greaterThan(0); // blockRevealed
    expect(data[2]).to.equal(4); // Score
  });

  it("should permit a reveal without a mint", async () => {
    const id = getTokenId(AMULET_2);
    await expect(contract.reveal("Test", AMULET_2, "https://example.com/"))
      .to.emit(contract, 'AmuletRevealed')
      .withArgs(id.toString('hex'), accounts[0].address, "Test", AMULET_2, "https://example.com/");
    
      expect(await contract.isRevealed(id)).to.equal(true);
      expect(await contract.balanceOf(accounts[0].address, id)).to.equal(1);
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
