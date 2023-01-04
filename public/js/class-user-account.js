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
                  
                  
                  //*******************************************************************************  ${data[0].first_name}
                  
                    document.getElementById("signup").innerHTML = `<div class="col-12 col-md-6 mx-auto">
                                
                                    <div class="account__name d-flex gap-3">
                                        <div class="mb-3">
                                            <input type="text" class="form-control" id="firstname" title="Firstname" placeholder="Firstname *" value=${data[0].first_name} required>
                                        </div>
                                        <div class="mb-3">
                                            <input type="text" class="form-control" id="lastname" title="Lastname" placeholder="Lastname *" value=${data[0].last_name} required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <input type="email" class="form-control" id="email" title="Email" placeholder="Email *" value=${data[0].email} required>
                                    </div>
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="nickname" title="Nikname" placeholder="Nickname *" value=${data[0].nickname} required>
                                    </div>
                                    
                                     <div class="mb-3">
                                        <input type="text" class="form-control" id="wallet-id" title="Metamask address" placeholder="Metamask address *" value=${typeof data[0].wallet_id === null?"":data[0].wallet_id} required>
                                    </div>
                                    <hr>
                    
                                </div>`; 
                                
                                
               
           }
           else
           
           {
                  let user = new User_data('findbywalletid/' + window.localStorage.getItem('userWalletAddress'))     
                  const data = await user.getData();
                  console.log(data);
                  
                                   
                    document.getElementById("signup").innerHTML = `<div class="col-12 col-md-6 mx-auto">
                                   
                                    <div class="account__name d-flex gap-3">
                                        <div class="mb-3">
                                            <input type="text" class="form-control" id="firstname" title="Firstname" placeholder="Firstname *" value=${data[0].first_name} required>
                                        </div>
                                        <div class="mb-3">
                                            <input type="text" class="form-control" id="lastname" title="Lastname" placeholder="Lastname *" value=${data[0].last_name} required>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <input type="email" class="form-control" id="email" title="Email" placeholder="Email *" value=${data[0].email} required>
                                    </div>
                                    <div class="mb-3">
                                        <input type="text" class="form-control" id="nickname" title="Nikname" placeholder="Nickname *" value=${data[0].nickname} required>
                                    </div>
                                    
                                     <div class="mb-3">
                                        <input type="text" class="form-control" id="wallet-id" title="Metamask address" placeholder="Metamask address *" value=${data[0].wallet_id} required>
                                    </div>
                                    <hr>
                    
                                </div>`; 
                                
                        
           }
     }

}
app();