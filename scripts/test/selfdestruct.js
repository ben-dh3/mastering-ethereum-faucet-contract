const { ethers } = require("hardhat");

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
    //deploy contract
    const Faucet = await ethers.getContractFactory("faucet");
    const faucet = await Faucet.deploy();
    await faucet.deployed();

    console.log("faucet deployed to:", faucet.address);

    const addresses = [owner.address, contributor.address, faucet.address];
    console.log("start");
    await printBalances(addresses);
    //contributor makes deposit
    const deposit = {value: hre.ethers.utils.parseEther("10")};
    await faucet.connect(contributor).deposit(deposit);
    console.log("deposit made");
    await printBalances(addresses);
    //owner withdraws 1eth from faucet
    await faucet.connect(owner).withdraw("1000000000000000000");

    console.log("faucet withdrawal");
    await printBalances(addresses);
    //owner calls selfdestruct function on contract
    await faucet.connect(owner).destroy();

    console.log("contract destroyed");
    await printBalances(addresses);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });