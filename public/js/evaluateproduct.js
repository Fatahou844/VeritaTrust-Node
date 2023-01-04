
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
               
               /*

               axios.post("https://dev.veritatrust.com/sessionandevaluate", {
    
                          idToken: idToken,
                          idWallet: "",
                          title: document.getElementById("title").value,
                          content: document.getElementById("content").value,
                          rating: parseInt(document.getElementById("review-value").innerHTML),
                          experience_date: document.getElementById("date").value.toString() + ' 00:00:00',
                          email: user.email

    
                           })
                           .then(res => {
                              window.location.assign("/user-dashboard");
                              console.log(res)
                           });  
                       */
                       
                                         const input = document.querySelector('#image');
                                                    const file = input.files[0];
                                                    const files = input.files;
                                                    for(var item = 0; item < files.length; item++)
                                                    {
                                                        files[item] instanceof File;
                                                        files[item] instanceof Blob;
                                                    }
                                                    
                                                    file instanceof File; // true
                                                    file instanceof Blob; // true
                                                       
                                                    
                                                    /* ************************************************************************************************************************************** */
                                                    const formData = new FormData();
                                                    formData.append('idToken', idToken);
                                                    formData.append('idWallet', "");
                                                    formData.append('rating', parseInt(document.getElementById("review-value").innerHTML));
                                                    formData.append('title', document.getElementById("title").value);
                                                    formData.append('content', document.getElementById("content").value);
                                                    formData.append('experience_date', document.getElementById("date").value.toString() + ' 00:00:00');
                                                    formData.append('email', user.email  );
                                                    formData.append('product_name', window.location.pathname.split('/')[3].replaceAll('%20',' '));
                                                   
                                                    
                                                    if(input.files.length > 0)
                                                    {
                                                        for(var k = 0; k < files.length; k++)
                                                                formData.append('image'+k.toString(),files[k]);
                                                    }
                                                    
                                                    // Post the form, just make sure to set the 'Content-Type' header
                                                    const res =  axios.post("https://dev.veritatrust.com/session-productevaluate", formData, {
                                                      headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                      }
                                                    })
                                                    .then(res => {
                                                              if(res.data == "profile")
                                                                    
                                                                                window.location.assign('/user-dashboard');
                                                                    else 
                                                                                window.location.assign('/update_account');
                                                            
                                                            
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
                                window.location.assign("/create_account");
                      });
           }, function(error) {
              console.log('Signout Failed')  
           });
        }
        
        function getCookie(name) {
    
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        }
        else
        {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
            end = dc.length;
            }
        }
        // because unescape has been deprecated, replaced with decodeURI
        //return unescape(dc.substring(begin + prefix.length, end));
        return decodeURI(dc.substring(begin + prefix.length, end));

    
} 
        
        function publishing() {
            
            
            
             var Token = "";
             var email = "";
             var Wallet = "";
            
             if(getCookie("session") !== null)
             {
                 email =  window.localStorage.getItem("emailAdress");
                 Token = "Token";
                 Wallet = "";
             }
             
             else
             {
                 email = ""; 
                 Token = "";
                 Wallet = window.localStorage.getItem("userWalletAddress");
             }
            
            /*
            axios.post("https://dev.veritatrust.com/sessionandevaluate", {
    
                          idToken: Token,
                          idWallet: Wallet,
                          title: document.getElementById("title").value,
                          content: document.getElementById("content").value,
                          rating: parseInt(document.getElementById("review-value").innerHTML),
                          experience_date: document.getElementById("date").value.toString() + ' 00:00:00',
                          email: email

    
                           })
                           .then(res => {
                                window.location.assign("/user-dashboard");
                                
                                console.log(res);
                           });  */
                           
            const input = document.querySelector('#image');
                                                    const file = input.files[0];
                                                    const files = input.files;
                                                    for(var item = 0; item < files.length; item++)
                                                    {
                                                        files[item] instanceof File;
                                                        files[item] instanceof Blob;
                                                    }
                                                    
                                                    file instanceof File; // true
                                                    file instanceof Blob; // true
                                                       
                                                    
                                                    /* ************************************************************************************************************************************** */
                                                    const formData = new FormData();
                                                    formData.append('idToken', Token);
                                                    formData.append('idWallet', Wallet);
                                                    formData.append('rating', parseInt(document.getElementById("review-value").innerHTML));
                                                    formData.append('title', document.getElementById("title").value);
                                                    formData.append('content', document.getElementById("content").value);
                                                    formData.append('experience_date', document.getElementById("date").value.toString() + ' 00:00:00');
                                                    formData.append('email', email);
                                                    formData.append('product_name', window.location.pathname.split('/')[3].replaceAll('%20',' '));
                                                   
                                                    
                                                    if(input.files.length > 0)
                                                    {
                                                        for(var k = 0; k < files.length; k++)
                                                                formData.append('image'+k.toString(),files[k]);
                                                    }
                                                    
                                                    // Post the form, just make sure to set the 'Content-Type' header
                                                    const res =  axios.post("https://dev.veritatrust.com/session-productevaluate", formData, {
                                                      headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                      }
                                                    })
                                                    .then(res => {
                                                              if(res.data == "profile")
                                                                    
                                                                                window.location.assign('/user-dashboard');
                                                                    else 
                                                                                window.location.assign('/update_account');
                                                            
                                                            
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

                  /*axios.post("https://dev.veritatrust.com/sessionandevaluate", {
    
                          idToken: idToken,
                          idWallet: "",
                          title: document.getElementById("title").value,
                          content: document.getElementById("content").value,
                          rating: parseInt(document.getElementById("review-value").innerHTML),
                          experience_date: document.getElementById("date").value.toString() + ' 00:00:00',
                          email: user.email

    
                           })
                           .then(res => {
                                window.location.assign("/user-dashboard");
                           });   */
                           
                           
                         
                                         const input = document.querySelector('#image');
                                                    const file = input.files[0];
                                                    const files = input.files;
                                                    for(var item = 0; item < files.length; item++)
                                                    {
                                                        files[item] instanceof File;
                                                        files[item] instanceof Blob;
                                                    }
                                                    
                                                    file instanceof File; // true
                                                    file instanceof Blob; // true
                                                       
                                                    
                                                    /* ************************************************************************************************************************************** */
                                                    const formData = new FormData();
                                                    formData.append('idToken', idToken);
                                                    formData.append('idWallet', "");
                                                    formData.append('rating', parseInt(document.getElementById("review-value").innerHTML));
                                                    formData.append('title', document.getElementById("title").value);
                                                    formData.append('content', document.getElementById("content").value);
                                                    formData.append('experience_date', document.getElementById("date").value.toString() + ' 00:00:00');
                                                    formData.append('email', user.email  );
                                                    formData.append('product_name', window.location.pathname.split('/')[3].replaceAll('%20',' '));
                                                   
                                                    
                                                    if(input.files.length > 0)
                                                    {
                                                        for(var k = 0; k < files.length; k++)
                                                                formData.append('image'+k.toString(),files[k]);
                                                    }
                                                    
                                                    // Post the form, just make sure to set the 'Content-Type' header
                                                    const res =  axios.post("https://dev.veritatrust.com/session-productevaluate", formData, {
                                                      headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                      }
                                                    })
                                                    .then(res => {
                                                              if(res.data == "profile")
                                                                    
                                                                                window.location.assign('/user-dashboard');
                                                                    else 
                                                                                window.location.assign('/update_account');
                                                            
                                                            
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
                            var error = document.getElementById("error-message");
                            error.className = "callout callout-error d-flex";
                            error.innerHTML = "hcaptcha not verified!";
                        }
                  else
                  {
                         var error = document.getElementById("error-message");
                         error.className = "d-none";
                         const userAuth = firebase.auth().createUserWithEmailAndPassword(email, password).then(userData => {
                
                          /*  var user = {
                                    name: document.getElementById("firstname").value,
                                    uid: userAuth.uid,
                                    email: userAuth.email
                                }
                            writeUserData(user); */
                            userData.user.sendEmailVerification();
                            console.log("userData");
                            console.log(userData);
                            hcaptcha.reset();
                           
                            
                            var message = document.getElementById("message-confirm");
                            message.className = "callout callout-primary d-flex";
                            message.innerHTML = "Your account is created, Check your email for confirmation"
                        
                            
                        }).catch((error) => {
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          // ..
                        });
                        
                         hcaptcha.reset();
                  }
                 
                 
                
               });
               
            
           
      
            
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
                                   
                                    window.location.assign("/user-dashboard");
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
                        error.innerHTML = "invalid email and password combination";
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
          