const fs = require("fs");
const chalk = require("chalk");
const bre = require("hardhat");

const publishDir = "../react-app/src/contracts";

function publishContract(contractName) {
  console.log(
    " 💽 Publishing",
    chalk.cyan(contractName),
    "to",
    chalk.gray(publishDir)
  );
  try {
    let contract = fs
      .readFileSync(`${bre.config.paths.artifacts}/contracts/${contractName}.sol/${contractName}.json`)
      .toString();
    const address = fs
      .readFileSync(`${bre.config.paths.artifacts}/${contractName}.address`)
      .toString();
    contract = JSON.parse(contract);
    fs.writeFileSync(
      `${publishDir}/${contractName}.address.js`,
      `module.exports = "${address}";`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`
    );

    console.log(" 📠 Published "+chalk.green(contractName)+" to the frontend.")

    return true;
  } catch (e) {
    if(e.toString().indexOf("no such file or directory")>=0){
      console.log(chalk.yellow(" ⚠️  Can't publish "+contractName+" yet (make sure it getting deployed)."))
    }else{
      console.log(e);
      return false;
    }
  }
}

async function main() {
  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }
  const finalContractList = [];
  fs.readdirSync(bre.config.paths.sources).forEach((file) => {
    if (file.indexOf(".sol") >= 0) {
      const contractName = file.replace(".sol", "");
      // Add contract to list if publishing is successful
      if (publishContract(contractName)) {
        finalContractList.push(contractName);
      }
    }
  });
  fs.writeFileSync(
    `${publishDir}/contracts.js`,
    `module.exports = ${JSON.stringify(finalContractList)};`
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
