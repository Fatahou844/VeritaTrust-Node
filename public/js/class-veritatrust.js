class User_data {
  constructor(uri){
    this.uri = uri
  }
  async getData(){
    const response = await fetch('https://dev.veritatrust.com/user_profile.json/'+ this.uri, {
      method: 'GET'
    })
    const data = await response.json();
    return data;
  }
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

async function app(){
    
   if(getCookie("userWalletAddress") === null && getCookie("session") === null)
     {
            
                            
                    document.getElementById("container-menu").innerHTML = `            <a class="navbar-brand" href="/">
                <img src="/assets/img/logo-veritatrust-c.png" alt="Veritatrust" width="170">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <form class="d-flex w-lg-50 search my-3 my-lg-0" role="search" action="/search">
                    <input class="form-control" placeholder="search product or service" name="query">
                </form>
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-auto">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle active align-self-center" aria-current="page" href="/">Explore</a>
                        <ul class="submenu dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#"><i class="flaticon flaticon-user"></i> Domaine name</a></li>
                            <li><a class="dropdown-item" href="#"><i class="flaticon flaticon-user"></i> Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#"><i class="flaticon flaticon-user"></i> Something else here</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link  align-self-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Resources
                    </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link align-self-center" href="#">Blog</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link align-self-center" href="/create_account">Create</a>
                    </li>
                    <li class="nav-item"><a class="nav-link align-self-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#account" aria-controls="account"><i class="flaticon flaticon-user"></i></a></li>
                </ul>
            </div>`;
            
            
                    document.getElementById("account").innerHTML = `        <div class="offcanvas-body">
                    
            <!-- if not logued / login form -->
            <p>Connect by social account</p>
            <ul class="social-Connect">
                <li><button title="Connect with Facebook"><i class="flaticon-facebook" onclick = "facebookSignin()"></i></button></li>
                <li><button title="Connect with Google"><i class="flaticon-google" onclick = "googleSignin()"></i></button></li>
                <li><button title="Connect with MetaMask"><i class="flaticon-fox" id="metaloginbtn"></i></button></li>
                <li><button title="Connect with Apple"><i class="flaticon-apple"></i></button></li>
            </ul>
            <div class="orbymail text-center">
                <div class="separator">Or</div>
            </div>
            <p>Enter your login and password</p>
            <form id = "login">
                <div class="input-group">
                    <input type="email" class="form-control" id="usermail" aria-describedby="emailHelp" title="User Email" placeholder="User Email">
                    <span class="input-group-text bg-success text-white border-success">
                        <i class="flaticon-user"></i>
                    </span>
                </div>
                <div id="emailHelp" class="form-text text-white mb-3">We'll never share your email with anyone else.</div>
                <div class="input-group mb-3 ">
                    <input type="password" class="form-control" id="userpassword" title="Password" placeholder="Password">
                    <span class="input-group-text bg-success toggle-password text-white border-success">
                        <i class="flaticon-hide"></i>
                    </span>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="rememberme" checked>
                    <label class="form-check-label" for="rememberme">Stay connected</label>
                </div>
                
            </form>
            <button type="submit" class="btn btn-success" onclick = "emailPasswordLogin()" id="userbutton">Login</button>
            <div class="d-none" id ="error-message-2">
                                    <div class="me-3"><i class="flaticon-information"></i></div>
                                    <div>Error message</div>
                    </div>
            <hr>
            
            <a class= "btn btn-light" href="https://dev.veritatrust.com/resetpassword">Forgot your password</a>
            
            <p class="mt-3 mb-1">You haven't again an account ?</p>
          
           
             <button type="submit" class="btn btn-light" onclick="emailPasswordSignin()">Create my account</button>
        </div>
        
        <script>
        
            
            $(document).ready(function () {
              //your code here
              $(".toggle-password").click(function() {
                            $(this).children().toggleClass("flaticon-seen flaticon-hide");
                            let input = $(this).prev();
                            input.attr("type", input.attr("type") === "password" ? "text" : "password");
                        });
            });
         </script>
          
          <script>
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
    </script>
    <!-- Firebase UI
    <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
    <link
      type="text/css"
      rel="stylesheet"
      href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css"
    />
     <script src="./js/auth.js"></script>  -->
     <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
     <script>
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
                            window.location.assign("/user-dashboard");
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
              console.log('Signout Succesfull')
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
                                window.location.assign("/user-dashboard");
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
                        error.innerHTML = "nvalid email and password combination";
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
                //Built in firebase function responsible for sending the verification email
                firebase.auth.currentUser.sendEmailVerification()
                .then(() => {
                    console.log('Verification Email Sent Successfully !');
                    
                })
                .catch(error => {
                    console.error(error);
                })
            }
          </script>`; 
        
     }
     
     else
     {
         if(getCookie("session") !== null)
           {     
                  let user = new User_data(window.localStorage.getItem('emailAdress'))     
                  const data = await user.getData();
                  console.log(data);
                  
                  
                  //*******************************************************************************
                  
                    document.getElementById("container-menu").innerHTML = `<a class="navbar-brand" href="/">
                <img src="/assets/img/logo-veritatrust-c.png" alt="Veritatrust" width="170">
            </a>
            <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
            <a class="avatar-link nav-link align-self-center order-3 order-lg-5 position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#account" aria-controls="account">
                <span class="notification position-absolute translate-middle p-2 bg-danger rounded-circle">
                    <span class="visually-hidden">New alerts</span>
                </span>
             
              
                 <img class="user_avatar" src="/assets/img/level${data[0].level_account}.jpg" alt="Avatar" height="30" width="30">
                                    
                       
                
                <i class="flaticon-user-1 d-none"></i>
            </a>
            <div class="collapse navbar-collapse order-4" id="navbarSupportedContent">
                <form class="d-flex w-lg-50 search my-3 my-lg-0" role="search"  action="/search">
                    <input class="form-control" placeholder="Find products and services" name="query">
                </form>
                <ul class="navbar-nav mb-2 mb-lg-0 ms-auto me-2">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle active align-self-center" aria-current="page" href="/">Explore</a>
                        <ul class="submenu dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#"><i class="flaticon-user-1"></i> Domaine name</a></li>
                            <li><a class="dropdown-item" href="#"><i class="flaticon-user-1"></i> Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#"><i class="flaticon-user-1"></i> Something else here</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link  align-self-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Resources
                    </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link align-self-center" href="#">Blog</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link align-self-center" href="/create_account">Create</a>
                    </li>
                </ul>
            </div> 
             <script>
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
    </script>
    <!-- Firebase UI
    <script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
    <link
      type="text/css"
      rel="stylesheet"
      href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css"
    />
     <script src="./js/auth.js"></script>  -->
     <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
     <script>
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
                            window.location.assign("/user-dashboard");
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
              console.log('Signout Succesfull')
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
                                window.location.assign("/user-dashboard");
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
                        error.innerHTML = "nvalid email and password combination";
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
                //Built in firebase function responsible for sending the verification email
                firebase.auth.currentUser.sendEmailVerification()
                .then(() => {
                    console.log('Verification Email Sent Successfully !');
                    
                })
                .catch(error => {
                    console.error(error);
                })
            }
          </script>
            `;
            
            
                    document.getElementById("account").innerHTML = `<div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Your account</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            
            <!-- if logued / user menu -->
           
            <p class="lead">Hello ${data[0].first_name }, ${data[0].last_name}</p>
            
                        
            <div class="notifications">
                <div class="notification">
                    <span class="notification position-absolute translate-middle p-2 bg-danger rounded-circle">
                        <span class="visually-hidden">New alerts</span>
                    </span>
                    <p class="lead"><a href="/update_account">Titre de la notification</a></p>
                    <p>You must complete your profile</p>
                </div>
            </div>
            <ul class="list-unstyled list-profile">
                <li><a class="active" href="https://dev.veritatrust.com/user-dashboard">Dashboard</a></li>
                <li><a href="/update_account">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Reviews</a></li>
                <li><a href="#">Following</a></li>
                <li><a href="#">Sponsoring</a></li>
                <li><a href="#">Badges</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">FAQ</a></li>
            </ul>
            <!-- end if logued / user menu -->
            <button type="submit" class="btn btn-success text-white" onclick="googleSignout()">Logout</button>
        </div>`; 
        
           }
           else
           
           {
                  let user = new User_data('findbywalletid/' + window.localStorage.getItem('userWalletAddress'))     
                  const data = await user.getData();
                  console.log(data);
                  
                                   
                    document.getElementById("container-menu").innerHTML = `<a class="navbar-brand" href="/">
                <img src="/assets/img/logo-veritatrust-c.png" alt="Veritatrust" width="170">
            </a>
            <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
            <a class="avatar-link nav-link align-self-center order-3 order-lg-5 position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#account" aria-controls="account">
                <span class="notification position-absolute translate-middle p-2 bg-danger rounded-circle">
                    <span class="visually-hidden">New alerts</span>
                </span>
             
              
                 <img class="user_avatar" src="/assets/img/level${data[0].level_account}.jpg" alt="Avatar" height="30" width="30">
                                    
                       
                
                <i class="flaticon-user-1 d-none"></i>
            </a>
            <div class="collapse navbar-collapse order-4" id="navbarSupportedContent">
                <form class="d-flex w-lg-50 search my-3 my-lg-0" role="search"  action="/search">
                    <input class="form-control" placeholder="Find products and services" name="query">
                </form>
                <ul class="navbar-nav mb-2 mb-lg-0 ms-auto me-2">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle active align-self-center" aria-current="page" href="/">Explore</a>
                        <ul class="submenu dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#"><i class="flaticon-user-1"></i> Domaine name</a></li>
                            <li><a class="dropdown-item" href="#"><i class="flaticon-user-1"></i> Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item" href="#"><i class="flaticon-user-1"></i> Something else here</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link  align-self-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Resources
                    </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link align-self-center" href="#">Blog</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link align-self-center" href="/create_account">Create</a>
                    </li>
                </ul>
            </div>`;
            
            
                    document.getElementById("account").innerHTML = `<div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Your account</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            
            <!-- if logued / user menu -->
           
            <p class="lead">Hello ${data[0].first_name }, ${data[0].last_name}</p>
            
                        
            <div class="notifications">
                <div class="notification">
                    <span class="notification position-absolute translate-middle p-2 bg-danger rounded-circle">
                        <span class="visually-hidden">New alerts</span>
                    </span>
                    <p class="lead"><a href="/update_account">Titre de la notification</a></p>
                    <p>You must complete your profile</p>
                </div>
            </div>
            <ul class="list-unstyled list-profile">
                <li><a class="active" href="https://dev.veritatrust.com/user-dashboard">Dashboard</a></li>
                <li><a href="#">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Reviews</a></li>
                <li><a href="#">Following</a></li>
                <li><a href="#">Sponsoring</a></li>
                <li><a href="#">Badges</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">FAQ</a></li>
            </ul>
            <!-- end if logued / user menu -->
            <button type="submit" class="btn btn-success text-white" onclick="googleSignout()">Logout</button>
        </div>`; 
        
           }
     }

}
app();