const { validationNotification } = require('./validationNotification');
const { ethers } = require('ethers');
const SepoliaAddresses = require('../contract-sepolia-address.json');
const sequelize = require('sequelize');

const db = require('../models/index');

const Addresses =  SepoliaAddresses;

console.log(Addresses)


const HMTContractABI = require('../contract/artifacts/contracts/HMToken.json').abi;
const EscrowABI = require('../contract/artifacts/contracts/Escrow.json').abi;
const EscrowFactoryABI = require('../contract/artifacts/contracts/EscrowFactory.json').abi;


//const fromString = require('uint8arrays/from-string');
const { default: axios } = require('axios');
const ipfsClient = require('ipfs-http-client');

const { JsonRpcProvider } = require('@ethersproject/providers');

/*
const getProvider = () => {
  const rpcUrl = 'wss://multi-quaint-choice.ethereum-sepolia.discover.quiknode.pro/40632f095a916ca0b96478ef7623eb353872d488/'; // Remplacez par votre propre URL de nœud Ethereum
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};
*/

const deployEscrowContract = async (deployContent, job_address, USER_ID, productID, rating, length, reviewid) => {

    try {
        
        var provider = new ethers.providers.WebSocketProvider("wss://sepolia.infura.io/ws/v3/728a362015e549609f3f745e906e1b8b")
        //const provider = getProvider();
        
        //const network = await provider.send("qn_getTransactionsByAddress", ["FILL_ME_ARG_1"]);

        const signer = new ethers.Wallet(Addresses.deployAddrPrivate, provider);
        
        console.log("**********************Signer start*******************************")
        
        console.log("**********************Signer end*******************************")
        const hmtContract = new ethers.Contract(Addresses.tokenAddr, HMTContractABI, signer)
        
        console.log("hmtContract")
        const escrowFactoryContract = new ethers.Contract(Addresses.factoryAddr, EscrowFactoryABI, signer)
      
         console.log("**********************escrowFactoryContract start*******************************")
         console.log("**********************escrowFactoryContract end*******************************")
        
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

        // !!! CREATE ESCROW

        // !!! GET LATEST ESCROW ID

        const event = tsxCreateEscrow.events.find(
            (event) => event.event === 'Launched'
        );

        const [from, to, value] = event.args;
        console.log(from, to, value);

        console.log('to&last\n', to, lastEscrow);


        let escrowContract = new ethers.Contract(to, EscrowABI, signer)

        const escrowStatus = await escrowContract.status();
        console.log('status', escrowStatus);

        const beforeEscrow = await hmtContract.balanceOf(to);
        console.log('before escro', ethers.utils.formatEther(beforeEscrow));

        const beforeEscrowClient = await hmtContract.balanceOf("0x407CdDa48170470d66ac390B23F53A9f1e42C42a");
        console.log(
            'before escro client bal',
            ethers.utils.formatEther(beforeEscrowClient)
        );

        await fundEscrowAndChangeStatus(hmtContract, escrowContract, to);
        const hashfinal = await payout(deployContent, hmtContract, escrowContract, to, job_address)
        
        const sql_update1 =  `UPDATE product_review SET status = 'published' where status = 'pending' and job_id = '${job_address}'`;
        const sql_update2 =  `UPDATE transaction SET hash_transaction = '${hashfinal.transactionHash}' where transaction_id = '${job_address}'`;
        const sql_update3 =  `UPDATE products SET ReviewsNumber =  ReviewsNumber + 1  where id = '${productID}'`;
        const sql_update4 =  `UPDATE products SET ReviewMean =  ReviewMean + '${rating}'/'${length}'  where id = '${productID}'`;
        
        const currentDate = new Date();
        const formattedCreatedAt = currentDate.toISOString(); // Format ISO pour DATETIME
        const formattedUpdatedAt = currentDate.toISOString();
        
        const sql_insert =  `INSERT INTO notification(userId, notification_type, status, message,createdAt,updatedAt) VALUES(${USER_ID}, "emailing", "1", "reviews in blockchain",'${formattedCreatedAt}','${formattedUpdatedAt}')`;
        
        db.sequelize.query(sql_insert, { type: sequelize.QueryTypes.INSERT }).then(results => {
            console.log(results);
        // res.json(results);
        });

        db.sequelize.query(sql_update1, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        });

        db.sequelize.query(sql_update2, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        });
        
        
        
         db.sequelize.query(sql_update3, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        });
        
        db.sequelize.query(sql_update4, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        });
        
        validationNotification(USER_ID,hashfinal.transactionHash,"productreview",reviewid);

        const sql_string = `INSERT INTO reward (Reward_type, User_id, Job_id,reward_value) VALUES ('product_review',(SELECT product_review.user_id FROM product_review WHERE product_review.job_id = '${job_address}'),'${job_address}',1)`;
        
      /*  const sql_insert =  `INSERT INTO notification(userId, notification_type, status, message) VALUES(${USER_ID}, "emailing", "1", "reviews in blockchain")`;
        
        db.sequelize.query(sql_insert, { type: sequelize.QueryTypes.INSERT }).then(results => {
            console.log(results);
        // res.json(results);
        });
*/

        // Creation de la requette pour insérer un nouveau reward sur le compte du client
        
     /*   db.sequelize.query(sql_update2, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        }); */
                    
                    
    } catch (err) {
        console.error(err)
    }
};

const fundEscrowAndChangeStatus = async (hmtContract, escrowContract, to) => {
    // !!! FUND ESCROW;

    const tsxTransferEscrow = await hmtContract.transfer(
        to,
        ethers.utils.parseUnits('100', 'ether')
    );

    const tsxTransferEscrowRes = await tsxTransferEscrow.wait();
    console.log('tsxTransferEscrow', tsxTransferEscrowRes);

    // !!! CHANGE STATUS TO 1 FOR OWN FACTORY

    const setupEscrow = await escrowContract.setup(
        Addresses.repOracleAddr,
        Addresses.recOracleAddr,
        11,
        18,
        'https://burakkaraoglan.com/setup',
        'karaoglan_hash123_setup'
    );

    const tsxSetup = await setupEscrow.wait();
    console.log('setup', tsxSetup);

    const escrowStatus = await escrowContract.status();
    console.log('status', escrowStatus);
    // !!! CHANGE STATUS TO 1 FOR OWN FACTORY


    // !!! FUND ESCROW

};


const payout = async (deployContent, hmtContract, escrowContract, escrowAddress, job_address) => {

    const auth =
        'Basic ' + Buffer.from(process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET).toString('base64');

   /*const client = ipfsClient.create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });  

    const reviews = []

    for (const element of deployContent) {

       // const data = fromString(element.image, 'base64')
        const data = "jnjrefgsvdvgxvgbcdllkezjhfklezl:khdgxejazkj";

        const { cid: metadatacid } = await client.add(data)

        console.log(`Uploaded img uri : https://ipfs.infura.io/ipfs/${metadatacid}`)
        reviews.push({
            jobId: element.job_id,
            content: element.content + '_' + new Date(),
            images: [`https://ipfs.infura.io/ipfs/${metadatacid}`]
        })  

        /*const { cid: metadatacid } = await client.add({
            path: `/vrt-img/1`,
            content: 
        }) */
//   }
/***
    const hash = await client.add(JSON.stringify(reviews));

    const hashPath = `https://ipfs.infura.io/ipfs/${hash.path}`
    console.log(hashPath);  */

    const escrowBulkPay = await escrowContract.bulkPayOut(
        ["0x407CdDa48170470d66ac390B23F53A9f1e42C42a"],
        [ethers.utils.parseUnits('1')],
        'https://burakkaraoglan.com',
        "hashPath",
        4100
    );

    const tsxBulkPay = await escrowBulkPay.wait();
    console.log('tsxBulk', tsxBulkPay);
    

    const afterEscrow = await hmtContract.balanceOf(escrowAddress);
    console.log('after escro', ethers.utils.formatEther(afterEscrow));

    const afterEscrowClient = await hmtContract.balanceOf("0x407CdDa48170470d66ac390B23F53A9f1e42C42a");

    console.log(
        'after escro client bal',
        ethers.utils.formatEther(afterEscrowClient)
    );

    const afterRep = await hmtContract.balanceOf(Addresses.repOracleAddr);
    console.log('after reputation bal', ethers.utils.formatEther(afterRep));

    const afterRec = await hmtContract.balanceOf(Addresses.recOracleAddr);
    console.log('after recording bal', ethers.utils.formatEther(afterRec));

    const afterHmtBalanceOfOwner = await hmtContract.balanceOf(
        Addresses.deployAddr
    );
    console.log(
        'after hmt beforeHmtBalanceOfOwner',
        ethers.utils.formatEther(afterHmtBalanceOfOwner)
    );

    const finalHash = await escrowContract.finalResultsHash();
    console.log('Final hash', finalHash)
    
    return tsxBulkPay;
};


module.exports = {
   
    deployEscrowContract: deployEscrowContract,
}