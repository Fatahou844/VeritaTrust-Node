//const { validationNotification } = require('./validationNotification');
const { ethers } = require('ethers');
const SepoliaAddresses = require('../contract-sepolia-address.json');
//const sequelize = require('sequelize');

//const db = require('../models/index');

const Addresses =  SepoliaAddresses;
console.log(Addresses)


const HMTContractABI = require('../contract/artifacts/contracts/HMToken.json').abi;
const EscrowABI = require('../contract/artifacts/contracts/Escrow.json').abi;
const EscrowFactoryABI = require('../contract/artifacts/contracts/EscrowFactory.json').abi;


//const fromString = require('uint8arrays/from-string');
const { default: axios } = require('axios');
const ipfsClient = require('ipfs-http-client');

const deployEscrowContract = async() => {
    
    
    try {

        var provider = new ethers.providers.WebSocketProvider("wss://sepolia.infura.io/ws/v3/59b89e7145ca4e0f90b933589f8245a6")
                
        
        const signer = new ethers.Wallet(Addresses.deployAddrPrivate, provider);
        const hmtContract = new ethers.Contract(Addresses.tokenAddr, HMTContractABI, signer)
        
        const escrowFactoryContract = new ethers.Contract(Addresses.factoryAddr, EscrowFactoryABI, signer)
        
        const beforeHmtBalance = await hmtContract.totalSupply();
        console.log(
            'before hmt balance total',
            ethers.utils.formatEther(beforeHmtBalance)
        );
        
        const beforeHmtBalanceOfOwner = await hmtContract.balanceOf(
            Addresses.deployAddr
        );
        console.log(
            'before hmt beforeHmtBalanceOfOwner',
            ethers.utils.formatEther(beforeHmtBalanceOfOwner)
        );
        
        const factoryEIP = await escrowFactoryContract.eip20();
        console.log('EIP', factoryEIP);
        
        // !!! CREATE ESCROW
        
        const escrowAddr = await escrowFactoryContract.createEscrow([
            Addresses.deployAddr,
        ]);
        
        //client prv
        // 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e
        
        const tsxCreateEscrow = await escrowAddr.wait();
        const lastEscrow = await escrowFactoryContract.lastEscrow();
        console.log('lastEscrow',lastEscrow ); 
    }
    
    catch(err) {
        console.error(err)
    }
}

deployEscrowContract();
