const hre = require("hardhat");

async function getBalance(address) {
    const balanceBigInt = await hre.waffle.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
  }

async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
      console.log(`Address ${idx} balance: `, await getBalance(address));
      idx ++;
    }
  }


async function main() {

    const [owner, contributor] = await hre.ethers.getSigners();

    const Faucet = await ethers.getContractFactory("faucet");
    const faucet = await Faucet.deploy();
    await faucet.deployed();

    console.log("faucet deployed to:", faucet.address);

    const addresses = [owner.address, contributor.address, faucet.address];
    console.log();
    await printBalances(addresses);

    const deposit = {value: hre.ethers.utils.parseEther("10")};
    await faucet.connect(contributor).deposit(deposit);

    console.log("deposit made");
    await printBalances(addresses);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });