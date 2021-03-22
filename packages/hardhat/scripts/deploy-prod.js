const { BigNumber } = require("@ethersproject/bignumber");
const hre = require("hardhat");
const { ethers } = hre;

function getTokenId(a) {
  return ethers.utils.keccak256(Buffer.from(a));
}

const PRELOAD_MINTS = [
  {amulet: "We sought a talisman old meaning, and francophone", owner: "0xA2701F1dADaE0e1ee9fa68aB90ABBdA61cD9e06b"},
  {amulet: "     ✦\n•  ° °\n•✯    \n. ·   \n✸ .   \n  ✶✸  ", owner: "0xEC6d36A487d85CF562B7b8464CE8dc60637362AC"},
  {amulet: " ✸  \n. *.\n   ✯\n *✦ ", owner: "0xEC6d36A487d85CF562B7b8464CE8dc60637362AC"},
  {amulet: "  °•* \n✦  ✯  \n  ★✯  \n      \n     ✯\n *  ✹ ", owner: "0xEC6d36A487d85CF562B7b8464CE8dc60637362AC"},
  {amulet: "   ★\n✶°°✦\n· ✯★\n★ • ", owner: "0xEC6d36A487d85CF562B7b8464CE8dc60637362AC"},
  {amulet: ".✦✷·\n ✵.*\n  ✯ \n✦   ", owner: "0xEC6d36A487d85CF562B7b8464CE8dc60637362AC"},
  {amulet: "at.amulet.garden", owner: "0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5"},
  {amulet: "onward.amulet.garden", owner: "0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5"},
  {amulet: "big.ass.amulet.sh", owner: "0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5"},
  {amulet: "Within your gang, your coven, you must protect", owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"},
  {amulet: "perhaps.eth", owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"},
  {amulet: "snap", owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"},
  {amulet: "it words.", owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"},
  {amulet: "= 69", owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"},
  {amulet: "amul8hay5m27d1vrjleo3qw9qdhuwnmwr77dj5nf", owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"},
  {amulet: "blur idle boy swarm\nfocus ensure test fat seed\nacid puppy doll", owner: "0x83e4142225ECC3cE1a8061465d219c01B250e33A"},
  {amulet: "own mind that the artist sought", owner: "0x5e213d7c6F5B06E60f9C1d5a7B62d0A000F38690"},
  {amulet: "Healing; what are we all if not healing!", owner: "0xc72c85bdd6584324619176618e86e5e3196c6b47"},
  {amulet: "Bewail yourself; \nFear is the mind-killer. \n\nPriestism.", owner: "0xc72c85bdd6584324619176618e86e5e3196c6b47"},
  {amulet: "Enhearten said the world; \nSerotherapy...\nNot for me though;", owner: "0xc72c85bdd6584324619176618e86e5e3196c6b47"},
  {amulet: "Valorous said the world! \nEncumbrance...\nNot for me though 😞", owner: "0xc72c85bdd6584324619176618e86e5e3196c6b47"},
  {amulet: "Amul888888888888888888888888888", owner: "0xd3793500233f1637Cf74F3913F81E26F430E9A9F"}
];

const PRELOAD_REVEALS = [
  {
    title: "instructions to the prospector",
    amulet: "If you can't write poems,\nwrite me",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210222-4a10a2390ba77eb9301d6780b3df86a9",
    owner: "0xec6d36a487d85cf562b7b8464ce8dc60637362ac"
  }, {
    title: "amulet for another year",
    amulet: "IN THE SPRING MY LUNGS\nSTILL SOMEHOW EXPAND.",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-7b620c3ec3893c9ac7ab1db7998c5c83",
    owner: "0x2d1f6d2cb1d24d89b195eaf8b8bfec1096d7c0b9"
  }, {
    title: "it happens",
    amulet: "A MAN ONCE MAILED ME\nA PIECE OF HIS HEART",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-bb53c4f76dfa74c64486f33459fea90c",
    owner: "0x2206445d241ccb7dae93b2d2acfc67f75b90fd76"
  }, {
    title: "common amulets, 1 of 3",
    amulet: "THIS AMULET\nAT ANY PRICE\nFELT LIKE THE TRUTH",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-416fd5ebe79405c0bf5b6a92cd306258",
    owner: "0x10ec976c862a0e48c932fb53b5c542b5cbb13cf1"
  }, {
    title: "common amulets, 2 of 3",
    amulet: "this amulet is a simple token which proves my love's truth",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-b34ee9317d042502c2e7b462802f08ca",
    owner: "0x3111327edd38890c3fe564afd96b4c73e8101747"
  }, {
    title: "common amulets, 3 of 3",
    amulet: "DON'T WORRY.",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-9e38b918ecfd9bfb051287bf71556736",
    owner: "0x65f753145cf3395170b6f0ae4c351003b77b0366"
  }, {
    title: "aubade",
    amulet: "in the early hours of the new year\ni lie on my back\nwaiting.",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210225-c30c1e2eb51f7584d2ed1dfc4a8b2d0d",
    owner: "0x3cbd91e7df68837e969a43c8d56653078565ee8c"
  }, {
    title: "number eight",
    amulet: "All my life I had this\nimage of what a poet\nshould be",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210225-4c6a33595f139d49a8626d3d22f07967",
    owner: "0x273c25abd33eca095e228fde0f15e8f7ec4eb4d9"
  }, {
    title: "rare bollywood amulet",
    amulet: "chaiyya chaiyya",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210224-cb6672fd6f2882adc93df5ffb5fe7b98",
    owner: "0x5e46a8ecd4f4f0737ad7b7d243e767861885ed06"
  }, {
    title: "JOURNEY > DESTINATION*",
    amulet: "THE REAL AMULET IS THE FRIENDS WE MADE ALONG THE WAY*",
    offsetURL: "",
    owner: "0x256cbf17dd6271fa227e2f3dfe9beed7cf769af6"
  }, {
    title: "Postcard from Barcelona, February 2021",
    amulet: "i rove the plazas of gràcia,\ncrowds move by.\n\ncloth on faces",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210225-526163f8facd542931c9d088b1fd8263",
    owner: "0x31e0c619edc050862553812230af14644e757ce0"
  }, {
    title: "🧿 1/∞",
    amulet: "🚬 👑 🍣",
    offsetURL: "https://ipfs.io/ipfs/QmYXZAt8FmYhZbdR3qmpwaxm84J9XkkCuBiAUxroMoRxP7?filename=planetair-certificat-C20210228-2437.pdf",
    owner: "0xad4866157fb1a6bf1b90be1f9608ba86c32b5b19"
  }, {
    title: "seasonal amulets, 1 of 4",
    amulet: "Winter evening, a leaf, a blue sky above.",
    offsetURL: "https://registry.verra.org/myModule/rpt/myrpt.asp?r=206&h=127126",
    owner: "0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5"
  }, {
    title: "currently feeling",
    amulet: "Lethargically good.",
    offsetURL: "https://www.charlebois.solutions/c/",
    owner: "0x06f4db783097c632b888669032b2905f70e08105"
  }, {
    title: "Conscious, yet uncertain...",
    amulet: "An amulet is a self-aware house? ",
    offsetURL: "https://tinyurl.com/mwmwz3y6",
    owner: "0x25e0fbc652cfc890d308961b7d34c08d109a491b"
  }, {
    title: "Genesis Amulet 1",
    amulet: "for the data being hashed – this is dire",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210319-ed6aaabaed97ec35ab177a16731b6f34",
    owner: "0x5ba02f4ff6af1d9d2af8774d10fd32eb57d4e2e6"
  }, {
    title: "Love/Hate Relationships",
    amulet: "😐💘",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210224-c285ff206020b274938631e4e5cbf9c2",
    owner: "0x5fe557449c56e923d678b0ed68ca7a1baca92d60"
  }, {
    title: "NFT Shitcoin Faucet",
    amulet: "🚽",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210224-fb77edea2be1c655315b7731f3cb42fa",
    owner: "0x5fe557449c56e923d678b0ed68ca7a1baca92d60"
  }, {
    title: "Leading 8s are lucky, right?",
    amulet: "cYClOtRIMEThYLeNETrinItrAMiNE",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210224-73532dce0ec769980a4b0f0c9b6a4a5b",
    owner: "0x4f4ebf556cfdc21c3424f85ff6572c77c514fcae"
  }, {
    title: "Crypto: the SECOND best way to have a heart attack",
    amulet: "artERioLoscLEroSes",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-0d09abd9081a051125fd30ca679c4303",
    owner: "0x4f4ebf556cfdc21c3424f85ff6572c77c514fcae"
  }, {
    title: "But which is the legend",
    amulet: "👦🏼🎣",
    offsetURL: "https://gateway.pinata.cloud/ipfs/QmTTksasfGBPQKe9okroCcfdLiY8S7DdokPqoMaPB7tdXJ",
    owner: "0x5fe557449c56e923d678b0ed68ca7a1baca92d60"
  }, {
    title: "We're all gonna make it.",
    amulet: "aaAaAaaAaAaAAa",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210223-181b661426576b1f2b11119ba4960e82",
    owner: "0x2c5a1b217f447afec9939c270a64c10ed004e29c"
  }, {
    title: "If someone asked me how I feel looking for amulets...",
    amulet: "«...i'm dancing in a nutshell»",
    offsetURL: "http://bit.ly/3eUdmfj",
    owner: "0x0d333bc73c3f2d4e597f29ab7ab11dde42f0e3ba"
  }, {
    title: "Dont do it",
    amulet: "We do not do it...",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210310-488b81a0d937aac1fa55fa2867749c46",
    owner: "0x0d333bc73c3f2d4e597f29ab7ab11dde42f0e3ba"
  }, {
    title: "Not sure",
    amulet: "Yes, I am not sure, I.",
    offsetURL: "https://dashboard.cloverly.com/receipt/20210228-de05f37b0d72627248031a2c0869bfdd",
    owner: "0x2d1f6d2cb1d24d89b195eaf8b8bfec1096d7c0b9"
  }
];

async function main() {
  for(const amulet of PRELOAD_MINTS.concat(PRELOAD_REVEALS)) {
    if(!ethers.utils.sha256(Buffer.from(amulet.amulet)).includes('8888')) {
      console.log(`"${amulet.amulet}" is not an amulet!`);
      return;
    }
  }

  const MINTS = PRELOAD_MINTS.map((a) => ({tokenId: getTokenId(a.amulet), owner: a.owner}));

  const provider = (await ethers.getSigners())[0].provider;
  const Amulet = await ethers.getContractFactory("Amulet");
  const amulet = await Amulet.deploy(process.env['OPENSEA_PROXY'], MINTS, PRELOAD_REVEALS);

  const tx = await amulet.deployed();

  console.log(`Amulet deployed to ${amulet.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
