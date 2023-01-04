  let correctNetwork = "0x1" // Ethereum Mainnet
            let eventListenersSet = false
            let account;
            let web3;
            let network;
            
            function getAccount() {
              window.ethereum ?
                ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
                  account = accounts[0]
                  web3 = new Web3(ethereum)
                  network = ethereum.chainId
                  
                  // Check if network is correct
                  network === correctNetwork ?
                    console.log("You're on the correct network")
                      : 
                    console.log("You're on the wrong network")
          
                  // Set event listeners
                  if (!eventListenersSet) {
                      ethereum.on('accountsChanged', function () {
                          getAccount()
                      })
          
                      ethereum.on('chainChanged', function () {
                          getAccount()
                      })
                      eventListenersSet = true
                  }
                }).catch((err) => console.log(err))
              : console.log("Please install MetaMask")
            }