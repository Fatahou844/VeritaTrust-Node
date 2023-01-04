// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');
var fs = require('fs');
//const ethers = require('ethers');

async function main() {

    const HMTokenContract = await hre.ethers.getContractFactory('HMToken');
    //const hmToken = await HMTokenContract.deploy(ethers.utils.parseUnits('1000', 18), "HMKARssToken", 18, "HMKAR");
    const hmToken = await HMTokenContract.deploy(
        100000,
        'HMKARssToken',
        18,
        'HMKAR'
    );
    await hmToken.deployed();

    console.log('hmtoken deployed to:', hmToken.address);

    let factoryAddr = process.env.HMT_RINKEBY_ESCROW_FACTORY_ADDR;

    // TODO after hmt eip rinkeby is accessed
    //if (hre.network.name !== "rinkeby") {
        const EscrowFactoryContract = await hre.ethers.getContractFactory(
            'EscrowFactory'
        );
        const escrowFactory = await EscrowFactoryContract.deploy(hmToken.address);
    
        await escrowFactory.deployed();
    
        console.log('factory deployed to:', escrowFactory.address);
        factoryAddr = escrowFactory.address;
    //}

    // rep oracle 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0
    // rec oracle 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

    var toStr = {
        deployAddr: process.env.DEPLOYER_ADDR,
        tokenAddr: hmToken.address,
        factoryAddr,
        repOracleAddr: process.env.REPUTATION_ORACLE_ADDR,
        recOracleAddr: process.env.RECORDING_ORACLE_ADDR,
    };

    if (hre.network.name === "rinkeby") {
        fs.writeFileSync(
            '../../contract-rinkeby-address.json',
            JSON.stringify(toStr),
            'utf-8'
        );
    }

    fs.writeFileSync(
        '../../contract-address.json',
        JSON.stringify(toStr),
        'utf-8'
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
