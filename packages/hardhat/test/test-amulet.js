const { expect } = require("chai");
const { ethers } = require("hardhat");

AMULET_1 = "DON'T WORRY.";
AMULET_2 = "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*";

function getTokenId(a) {
  return ethers.utils.keccak256(Buffer.from(a));
}

PREMINE_MINTS = [
  {tokenId: getTokenId("If you can't write poems,\nwrite me"), owner:"0xEC6d36A487d85CF562B7b8464CE8dc60637362AC"},
  {tokenId: getTokenId("IN THE SPRING MY LUNGS\nSTILL SOMEHOW EXPAND."), owner: "0x2D1F6D2cB1D24D89b195Eaf8B8bFEc1096d7c0b9"}
];

PREMINE_REVEALS = [
  {title: "Amulet 1", amulet: "A MAN ONCE MAILED ME\nA PIECE OF HIS HEART", offsetURL: "https://example.com/", owner: "0x2206445D241cCB7DAE93B2D2acFC67f75B90fD76"},
  {title: "Amulet 2", amulet: "THIS AMULET\nAT ANY PRICE\nFELT LIKE THE TRUTH", offsetURL: "https://example.com/", owner: "0x10ec976C862a0e48c932Fb53B5C542B5CBb13cF1"}
];


describe("Amulet", function() {
  let accounts;
  let contract;

  before(async () => {
    accounts = await ethers.getSigners();
  });
  
  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Amulet");
    contract = await Contract.deploy('0x0000000000000000000000000000000000000000', PREMINE_MINTS, PREMINE_REVEALS);
    await contract.deployed();
  });

  it("should mint premined tokens", async () => {
    for(const amulet of PREMINE_MINTS) {
      const data = await contract.getData(amulet.tokenId);
      expect(data[0]).to.equal(amulet.owner);
      expect(data[1].toNumber()).to.equal(0);
      expect(data[2]).to.equal(0);
    }

    for(const amulet of PREMINE_REVEALS) {
      const data = await contract.getData(getTokenId(amulet.amulet));
      expect(data[0]).to.equal(amulet.owner);
      expect(data[1].toNumber()).to.be.greaterThan(0);
      expect(data[2]).to.be.greaterThan(3);
    }

    const receipt = await ethers.provider.getTransactionReceipt(contract.deployTransaction.hash);
    console.log(`Deploy: ${receipt.gasUsed} gas`);
  });

  it("should mint amulets", async () => {
    const id = getTokenId(AMULET_1);
    const tx = contract.mint([accounts[0].address, id]);
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
    await (await contract.mint([accounts[0].address, id])).wait();
  
    const title = "common amulets, 3 of 3";
    const offset = "example.com";
    const tx = contract.reveal([title, AMULET_1, offset]);
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

  it("should not allow non-owners to reveal amulets", async () => {
    const id = getTokenId(AMULET_1);
    await (await contract.mint([accounts[0].address, id])).wait();

    const title = "common amulets, 3 of 3";
    const offset = "example.com";
    const contract1 = contract.connect(accounts[1]);
    await expect(contract1.reveal([title, AMULET_1, offset])).to.be.reverted;
  });

  it("should mint and reveal together", async () => {
    const id = getTokenId(AMULET_2);
    const tx = contract.mintAndReveal(["Test", AMULET_2, "https://example.com/", accounts[0].address]);
    await expect(tx)
      .to.emit(contract, 'AmuletRevealed')
      .withArgs(id.toString('hex'), accounts[0].address, "Test", AMULET_2, "https://example.com/")
      .to.emit(contract, 'TransferSingle')
      .withArgs(accounts[0].address, '0x0000000000000000000000000000000000000000', accounts[0].address, id.toString('hex'), 1);
    const receipt = await (await tx).wait();
    console.log(`MintAndReveal: ${receipt.gasUsed} gas`);
      
      expect(await contract.isRevealed(id)).to.equal(true);
      expect(await contract.balanceOf(accounts[0].address, id)).to.equal(1);
  });

  it("should transfer amulets", async () => {
    const id = getTokenId(AMULET_1);
    await (await contract.mint([accounts[0].address, id])).wait();

    await expect(contract.safeTransferFrom(accounts[0].address, accounts[1].address, id, 1, "0x"))
      .to.emit(contract, 'TransferSingle')
      .withArgs(accounts[0].address, accounts[0].address, accounts[1].address, id.toString('hex'), 1);

    expect(await contract.ownerOf(id)).to.equal(accounts[1].address);
    expect(await contract.balanceOf(accounts[0].address, id)).to.equal(0);
    expect(await contract.balanceOf(accounts[1].address, id)).to.equal(1);
  })
});
