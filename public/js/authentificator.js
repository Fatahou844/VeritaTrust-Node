
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
                               if(window.location.href === "https://dev.veritatrust.com/create_account")
                                        window.location.assign('/user-dashboard');
                                   else   
                                   
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
                                   if(window.location.href === "https://dev.veritatrust.com/create_account")
                                        window.location.assign('/user-dashboard');
                                   else   
                                   
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
    
                                            
            function emailPasswordSignin() {
                
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            
            var my_token = hcaptcha.getResponse();
            
            axios.post('https://dev.veritatrust.com/verifycaptcha/token', {
                
                  name: "token",
                  token: my_token

               })
               .then(res => {
                  console.log(res)
    
                  if( res.data=== "<span style='color: red';>"+ "hcaptcha verification failed" + "</span>" )
                        {
                               var message = document.getElementById("message-confirm");
                               message.className = "d-none";
                            var error = document.getElementById("error-message");
                            error.className = "callout callout-error d-flex";
                            error.innerHTML = "hcaptcha not verified!";
                        }
                  else
                  {
                     if(document.getElementById("cgv").checked == true)
                      
                      {
                          console.log("is checked");
                          
                          if(document.getElementById("password").value === document.getElementById("password-confirm").value)
                          {
                              
                             var error = document.getElementById("error-message");
                             error.className = "d-none";
                             const userAuth = firebase.auth().createUserWithEmailAndPassword(email, password).then(userData => {
                    
                              /*  var user = {
                                        name: document.getElementById("firstname").value + " " + document.getElementById("lastname").value,
                                        uid: userAuth.uid,
                                        email: userAuth.email
                                    }
                                writeUserData(user);  */
                                userData.user.sendEmailVerification();
                                console.log("userData");
                                console.log(userData);
                                hcaptcha.reset();
                                
                                
                                        
                                        
                            
                              /*  var message = document.getElementById("message-confirm");
                                message.className = "callout callout-primary d-flex";
                                message.innerHTML = "Your account is created, Check your email for confirmation" */
                                
                                window.location.assign('/email-verified-message');
                            
                                
                            }).catch((error) => {
                              const errorCode = error.code;
                              const errorMessage = error.message;
                              
                               console.log("error"+error);
                                  var message = document.getElementById("message-confirm");
                               message.className = "d-none";
                              
                                var err = document.getElementById("error-message");
                                err.className = "callout callout-error d-flex";
                                err.innerHTML = "Error: this email is already registered";
                              // ..
                            });
                            
                          }
                          
                          else
                          
                          {
                               var message = document.getElementById("message-confirm");
                               message.className = "d-none";
                               
                               var err = document.getElementById("error-message");
                                err.className = "callout callout-error d-flex";
                                err.innerHTML = "passwords must be the same";
                          }
                      
                      }
                      else
                      {
                              console.log("is not checked");
                                 var message = document.getElementById("message-confirm");
                               message.className = "d-none";
                              var error = document.getElementById("error-message");
                                error.className = "callout callout-error d-flex";
                                error.innerHTML = "you must accept terms and conditions";
                      }
                        
                        
                         hcaptcha.reset();
                         
                         
                         
                  }
                 
                 
                
               });
               
            
           
      
            
            }
            
            
                function handleResetPassword(auth,actionCode) {
                  // Localize the UI to the selected language as determined by the lang
                  // parameter.
                
                  // Verify the password reset code is valid.
                  auth.verifyPasswordResetCode(actionCode).then((email) => {
                    const accountEmail = email;
                
                    const newPassword = "12345678";
                
                    // Save the new password.
                    auth.confirmPasswordReset(actionCode, newPassword).then((resp) => {
                      // Password reset has been confirmed and new password updated.
                      
                      console.log("password bas been reset with succes");
                      
                    }).catch((error) => {
                      // Error occurred during confirmation. The code might have expired or the
                      // password is too weak.
                    });
                  }).catch((error) => {
                    // Invalid or expired action code. Ask user to try to reset the password
                    // again.
                  });
                }
            
            function getParameterByName(name) {
                    if (name !== "" && name !== null && name != undefined) {
                        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                            results = regex.exec(location.search);
                        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
                    } else {
                        var arr = location.href.split("/");
                        return arr[arr.length - 1];
                    }
                
                }
            
            // fonction de login avec email et password
            
            function emailPasswordLogin() {
                
                var email = document.getElementById("usermail").value;
                var password = document.getElementById("userpassword").value;
                
                 const userAuth = firebase.auth().signInWithEmailAndPassword(email, password).then(userData => {
                     
                    if(userData.user.emailVerified == true)
                         
                    {
                        console.log(userData);
                        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                      // Send token to your backend via HTTPS
                        window.localStorage.setItem("emailAdress", userData.user.email);
    
                        axios.post("https://dev.veritatrust.com/sessionLogin", {
        
                                  idToken: idToken,
                                  idWallet: ""

        
                               })
                               .then(res => {
                                   
                                   if(window.location.href === "https://dev.veritatrust.com/create_account")
                                        window.location.assign('/user-dashboard');
                                   else   
                                   
                                      window.location.reload();
                               });  
                               
                          
                          console.log(" token to send");
                          console.log(idToken)
                          
                          // test email verification
                          // 
                          
                          
                        }).catch(function(error) {
                          // Handle error
                          
                          console.log(error);
                        });
                        
                        
                    }
                    
                   else
                    
                    {
                        console.log("email not verified")
                        var error = document.getElementById("error-message-2");
                        error.className = "callout callout-error d-flex";
                        error.innerHTML = "email has not verified, please check your email";
                    }
                   
                   
                    
                }).catch((error) => {
                    
                  console.log("error 400");
                  var error = document.getElementById("error-message-2");
                        error.className = "callout callout-error d-flex";
                        error.innerHTML = "Invalid email and password combination";
                  // ..
                });
                
                
            }
            
            // Fonction pour créer un utilisateur
            function writeUserData(user) {
                firebase.database().ref('users/' + user.uid).set(user).catch(error => {
                    console.log(error.message)
                });
            }
            
            const sendVerificationEmail = () => {
                //Built in firebase function responsible for sending the verificationail
                firebase.auth.currentUser.sendEmailVerification()
                .then(() => {
                    console.log('Verification Email Sent Successfully !');
                    
                })
                .catch(error => {
                    console.error(error);
                })
            }
          