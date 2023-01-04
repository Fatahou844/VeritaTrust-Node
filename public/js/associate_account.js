
      // Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyAo-8Xsea3mrUrLdRQl8jF0kWjurVR75BM",
            authDomain: "mvp-veritatrust-authen.firebaseapp.com",
            projectId: "mvp-veritatrust-authen",
            storageBucket: "mvp-veritatrust-authen.appspot.com",
            messagingSenderId: "674996552868",
            appId: "1:674996552868:web:27aa9d64343f27f034d231",
            measurementId: "G-DBYVG24K2G"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
 
        var provider = new firebase.auth.GoogleAuthProvider();
         var provider_fb = new firebase.auth.FacebookAuthProvider();
         provider_fb.addScope('email');
         provider_fb.addScope('user_birthday');
         

        function googleSignin() {
           firebase.auth()
           
           .signInWithPopup(provider).then(function(result) {
              var token = result.credential.accessToken;
              var user = result.user;
              
              console.log(token)
              console.log(user)
              
              firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  // Send token to your backend via HTTPS
                  
               window.localStorage.setItem("emailAdress", user.email);

               axios.post("https://dev.veritatrust.com/sessionLogin", {

                          idToken: idToken,
                          idWallet: ""

                       })
                       .then(res => {
                                     // window.location.reload();
                                     document.getElementById("google-associate").className="btn btn-success";
                                     document.getElementById("google-associate").innerHTML="Connected with Google";
                                     
                       });  
                       
                  
                  console.log(" token to send");
                  console.log(idToken)
                  
                }).catch(function(error) {
                  // Handle error
                });
            
           }).catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
        		
              console.log(error.code)
              console.log(error.message)
           });
        }
        
        function googleSignout() {
           firebase.auth().signOut()
        	
           .then(function() {
              axios.get('https://dev.veritatrust.com/sessionLogout')
                              .then((response) => {
                                window.localStorage.clear();
                                   if(window.location.href === "https://dev.veritatrust.com/create_account")
                                        window.location.assign('/user-dashboard');
                                   else   
                                   
                                      window.location.reload();
                      });
           }, function(error) {
              console.log('Signout Failed')  
           });
        }
        
        function facebookSignin() {
               firebase.auth()
               
               .signInWithPopup(provider_fb).then(function(result) {
                  var token = result.credential.accessToken;
                  var user = result.user;
            		
                  console.log(token)
                  console.log(user)
                  firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                  // Send token to your backend via HTTPS
                  window.localStorage.setItem("emailAdress", user.email);

                  axios.post("https://dev.veritatrust.com/sessionLogin", {
    
                              idToken: idToken,
                              idWallet: ""

    
                           })
                           .then(res => {
                                      window.location.reload();
                           });  
                           
                      
                      console.log(" token to send");
                      console.log(idToken)
                      
                    }).catch(function(error) {
                      // Handle error
                    });
               }).catch(function(error) {
                  var errorCode = error.code;
                  var errorMessage = error.message;
            		
                  console.log(error.code)
                  console.log(error.message)
                   var err = document.getElementById("error-message");
                            err.className = "callout callout-error d-flex";
                            err.innerHTML = "Error: this email is already registered with another account";
               });
            }
    
          