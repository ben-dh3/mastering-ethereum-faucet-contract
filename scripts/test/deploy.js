const { ethers } = require("hardhat");

async function main() {
    
const Faucet = await ethers.getContractFactory("faucet");
const faucet = await Faucet.deploy();
await faucet.deployed();

console.log("faucet deployed to:", faucet.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
