const { validationNotification } = require('./validationNotification');
const { AccountAddress, AccountTransactionType, CcdAmount, createConcordiumClient, ModuleReference, serializeUpdateContractParameters, signTransaction, TransactionExpiry, parseWallet, buildAccountSigner, } = require('@concordium/node-sdk');
const { credentials } = require('@grpc/grpc-js');
const { readFileSync } = require('node:fs');
const { Buffer } = require('buffer/index.js');
const  { createHash } = require("crypto");

const sequelize = require('sequelize');

const db = require('../models/index');
const ipfsClient = require('ipfs-http-client');

const { default: axios } = require('axios')

const createInfuraHash = async (deployContent, hmtContract, escrowContract, escrowAddress, job_address) => {
    const auth = 'Basic ' + Buffer.from(process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET).toString('base64');
    const client = ipfsClient.create({
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
        reviews.push({
            jobId: element.job_id,
            content: element.content + '_' + new Date(),
            images
        });
   }
   const hash = await client.add(JSON.stringify(reviews));

    const hashPath = `https://ipfs.infura.io/ipfs/${hash.path}`
    console.log(hashPath);
    
    return {hashFinal: hash, url: hashPath};
}


const deployToCcd = async (jobId, validFrom, url, hash) => {
  const salt = "80zzm081sr@nd0m";

  const reviewId = createHash("sha256")
    .update(jobId)
    .update(createHash("sha256").update(salt, "utf8").digest("hex"))
    .digest("hex");
  const client = createConcordiumClient("node.testnet.concordium.com", Number(20000), credentials.createInsecure());
  const walletFile = readFileSync("./test.export", 'utf8');
  const wallet = parseWallet(walletFile);
  const sender = new AccountAddress(wallet.value.address);
  const signer = buildAccountSigner(wallet);
  const maxCost = 30000n;
  const contractName = 'hash_reg';
  const receiveName = 'hash_reg.registerCredential';
  // const schema = await client.getEmbeddedSchema(moduleRef);
  const rawModuleSchema = Buffer.from(readFileSync('./schema.bin'));
  const updateHeader = {
      expiry: new TransactionExpiry(new Date(Date.now() + 3600000)),
      nonce: (await client.getNextAccountNonce(sender)).nonce,
      sender,
  };
  const params = {
      credential_info: {
          valid_from: validFrom, //"2023-08-24T12:00:00+05:00",
          valid_until: { "None": [] },
          holder_revocable: true,
          review_id: reviewId,
          holder_id: wallet.value.accountKeys.keys[0].keys[0].signKey,//"020e9fd962f4011bd155193dd9477d0481060aad98a26ab8b5b5dddbd884a604",
          metadata_url: {
              url,
              hash: { "Some": [hash] }
          },
      },
      "auxiliary_data": [44]
  };

  const updateParams = serializeUpdateContractParameters(contractName, 'registerCredential', params, rawModuleSchema);

  const updatePayload = {
      amount: new CcdAmount(0n),
      address: { "index": BigInt(6799), "subindex": BigInt(0) },
      receiveName,
      message: updateParams,
      maxContractExecutionEnergy: maxCost,
  };
  const updateTransaction = {
      header: updateHeader,
      payload: updatePayload,
      type: AccountTransactionType.Update,
  };
  const updateSignature = await signTransaction(updateTransaction, signer);
  const updateTrxHash = await client.sendAccountTransaction(updateTransaction, updateSignature);
  console.log('Transaction submitted, waiting for finalization...');
  const updateStatus = await client.waitForTransactionFinalization(updateTrxHash);
  console.dir(updateStatus, { depth: null, colors: true });
}


const deployEscrowContract = async (deployContent, job_address, USER_ID, productID, rating, length, reviewid) => {

    try {
        
        db.sequelize.query(`UPDATE product_review SET status = 'deleted' where status = 'moderation' and job_id = '${job_address}'`, { type: sequelize.QueryTypes.UPDATE }).then(results => {
            console.log(results);
        // res.json(results);
        });
        
        const currentDate = new Date();
        const formattedCreatedAt = currentDate.toISOString(); // Format ISO pour DATETIME
        const formattedUpdatedAt = currentDate.toISOString();

        const { hashFinal, url } = await createInfuraHash(deployContent, hmtContract, escrowContract, to, job_address)
        const deployedCcd = await deployToCcd(job_address, formattedCreatedAt, url, hashFinal)

        const sql_update1 =  `UPDATE product_review SET status = 'published' where status = 'pending' and job_id = '${job_address}'`;
        const sql_update2 =  `UPDATE transaction SET hash_transaction = '${hashfinal.transactionHash}' where transaction_id = '${job_address}'`;
        const sql_update3 =  `UPDATE products SET ReviewsNumber =  ReviewsNumber + 1  where id = '${productID}'`;
        const sql_update4 =  `UPDATE products SET ReviewMean =  ReviewMean + '${rating}'/'${length}'  where id = '${productID}'`;
        
        
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
                    
    } catch (err) {
        console.error(err)
    }
};


module.exports = {
   
    deployEscrowContract: deployEscrowContract,
}