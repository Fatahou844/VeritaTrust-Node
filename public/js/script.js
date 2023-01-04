'use strict';

//const coreABI = require('./core-abi.js');

const coreABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'evidenceDelegate',
        type: 'address'
      }
    ],
    name: 'EvidenceDelegateAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'agent',
        type: 'address'
      }
    ],
    name: 'EvidenceSubmitted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'isDelegate',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'proofOfHumanity',
    outputs: [
      {
        internalType: 'address',
        name: 'agent',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'timestamp',
        type: 'bytes'
      },
      {
        internalType: 'address',
        name: 'delegate',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'evidence',
        type: 'bytes'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'delegate',
        type: 'address'
      }
    ],
    name: 'addEvidenceDelegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'agent',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'timestamp',
        type: 'bytes'
      },
      {
        internalType: 'address',
        name: 'delegate',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'evidence',
        type: 'bytes'
      }
    ],
    name: 'submitEvidence',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'evidence',
        type: 'bytes'
      }
    ],
    name: 'splitEvidence',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'R',
        type: 'bytes32'
      },
      {
        internalType: 'bytes',
        name: 'agentSignature',
        type: 'bytes'
      },
      {
        internalType: 'bytes',
        name: 'delegateSignature',
        type: 'bytes'
      }
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'agent',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'timestamp',
        type: 'bytes'
      },
      {
        internalType: 'address',
        name: 'delegate',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'evidence',
        type: 'bytes'
      }
    ],
    name: 'validateEvidence',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const connectWallet = document.getElementById('connect-wallet');
  const connectWalletButton = document.getElementById('connect-wallet-button');
  const walletAddress = document.getElementById('wallet-address');
  
  const baseURL = 'http://dev.veritatrust.com/user_profile';

  const main = document.getElementById('main');

  const confirmOwnershipButton = document.getElementById(
    'confirm-ownership-button'
  );
  const ownershipConfirmation = document.getElementById(
    'ownership-confirmation'
  );
  const ownershipConfirmationSuccess = document.getElementById(
    'ownership-confirmation-success'
  );

  const form = document.getElementById('form');
  const submission = document.getElementById('submission');
  const submissionError = document.getElementById('submission-error');
  const submissionSuccess = document.getElementById('submission-success');
  const submissionTime = document.getElementById('submission-time');

  const delegateAddress = document
    .getElementById('delegate-address')
    .textContent.trim();
  const coreAddress = document
    .getElementById('core-address')
    .textContent.trim();

  let coreContract;
  let address;
  let R;
  let signature;

  connectWalletButton.addEventListener('click', async () => {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);

      const accounts = await web3.eth.getAccounts();
      address = accounts[0];

      coreContract = new web3.eth.Contract(coreABI, coreAddress);

      walletAddress.textContent = address;
      connectWallet.classList.add('hidden');
      main.classList.remove('hidden');
    } catch (error) {
      console.error(error);
    }
  });

  confirmOwnershipButton.addEventListener('click', async () => {
    try {
      R = web3.utils.keccak256(Math.random().toString());
      signature = await web3.eth.personal.sign(R, address);

      ownershipConfirmation.classList.add('hidden');
      ownershipConfirmationSuccess.classList.remove('hidden');
    } catch (error) {
      console.error(error);
    }
  });

    form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const token = formData.get('h-captcha-response');

    if (!signature || !token) {
      submissionError.textContent = 'Please complete all confirmations';
      return;
    }
    submissionError.textContent = null;
    
    // ***************************************** create userprofile with wallet id ********************************* /
    
    var url_string = window.location;
    var url = new URL(url_string);
    var jobID = url.searchParams.get("jobId");
    
    
    axios.post(baseURL, {
     
      wallet_id: address
      
      
   })
   .then(res => {
      console.log(res)
   
   });

  /*  try {
      const result = await fetch('/api/v1/evidence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, R, signature, token })
      });

      if (!result.ok) {
        if (result.status === 400) {
          submissionError.textContent = 'Evidence validation failed';
        } else {
          submissionError.textContent = 'Server error';
        }
        throw new Error(await result.text());
      }

      const { timestamp, evidence } = await result.json();

      const evidenceTime = new Date(parseInt(timestamp, 16)).toISOString();

      coreContract.once(
        'EvidenceSubmitted',
        { filter: { agent: address } },
        (error, event) => {
          if (error) {
            console.error(error);
            return;
          }

          const agent = event?.returnValues?.agent;
          if (agent !== address) {
            return;
          }

          submission.classList.add('hidden');
          submissionTime.textContent = evidenceTime;
          submissionSuccess.classList.remove('hidden');
        }
      );

      await coreContract.methods
        .submitEvidence(address, timestamp, delegateAddress, evidence)
        .send({ from: address });
    } catch (error) {
      console.error(error);
    } */
  });  
});

function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
    return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
}