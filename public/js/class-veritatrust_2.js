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
            
          
     }
     
     else
     {
         if(getCookie("session") !== null)
           {     
                  let user = new User_data(window.localStorage.getItem('emailAdress'))     
                  const data = await user.getData();
                  console.log(data);
                  
                  
                  //*******************************************************************************
                  
                    document.getElementById("container-menu").innerHTML = `<a class="navbar-brand" href="./">
                <img src="./assets/img/logo-veritatrust-c.png" alt="Veritatrust" width="170">
            </a>
            <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
            <a class="avatar-link nav-link align-self-center order-3 order-lg-5 position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#account" aria-controls="account">
                <span class="notification position-absolute translate-middle p-2 bg-danger rounded-circle">
                    <span class="visually-hidden">New alerts</span>
                </span>
             
              
                 <img class="user_avatar" src="./assets/img/level${data[0].level_account}.jpg" alt="Avatar" height="30" width="30">
                                    
                       
                
                <i class="flaticon-user-1 d-none"></i>
            </a>
            <div class="collapse navbar-collapse order-4" id="navbarSupportedContent">
                <form class="d-flex w-lg-50 search my-3 my-lg-0" role="search"  action="/search">
                    <input class="form-control" placeholder="Find products and services" name="query">
                </form>
                <ul class="navbar-nav mb-2 mb-lg-0 ms-auto me-2">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle active align-self-center" aria-current="page" href="./">Explore</a>
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
                        <a class="nav-link align-self-center" href="#">Create</a>
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
           else
           
           {
                  let user = new User_data('findbywalletid/' + window.localStorage.getItem('userWalletAddress'))     
                  const data = await user.getData();
                  console.log(data);
                  
                                   
                    document.getElementById("container-menu").innerHTML = `<a class="navbar-brand" href="./">
                <img src="./assets/img/logo-veritatrust-c.png" alt="Veritatrust" width="170">
            </a>
            <button class="navbar-toggler ms-auto me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
            <a class="avatar-link nav-link align-self-center order-3 order-lg-5 position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#account" aria-controls="account">
                <span class="notification position-absolute translate-middle p-2 bg-danger rounded-circle">
                    <span class="visually-hidden">New alerts</span>
                </span>
             
              
                 <img class="user_avatar" src="./assets/img/level${data[0].level_account}.jpg" alt="Avatar" height="30" width="30">
                                    
                       
                
                <i class="flaticon-user-1 d-none"></i>
            </a>
            <div class="collapse navbar-collapse order-4" id="navbarSupportedContent">
                <form class="d-flex w-lg-50 search my-3 my-lg-0" role="search"  action="/search">
                    <input class="form-control" placeholder="Find products and services" name="query">
                </form>
                <ul class="navbar-nav mb-2 mb-lg-0 ms-auto me-2">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle active align-self-center" aria-current="page" href="./">Explore</a>
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
                        <a class="nav-link align-self-center" href="#">Create</a>
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