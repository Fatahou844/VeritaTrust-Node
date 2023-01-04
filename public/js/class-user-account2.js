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
                                
                                
                                
                 document.getElementById("updateaccount").innerHTML = `                  <div class="col-md-3 mb-3">
                                        <div class="userpicture">
                                            <img class="user-profil-avatar" src="./assets/img/lorem-portrait.jpg" alt="user-avatar">
                                            <label class="add-visual" id="userpicture">
                                                <input name="userpicture" accept="image/jpeg, image/webp, image/png" type="file" class="d-none">
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="username mb-3">
                                            <label class="text-primary" for="username">Display name</label>
                                            <input id="username" class="form-control editable" type="text" value=${data[0].nickname} disabled>
                                        </div>
                                        <div class="firstname mb-3">
                                            <label class="text-primary" for="firstname">First name</label>
                                            <input id="firstname" class="form-control editable" type="text" value=${data[0].first_name} disabled>
                                        </div>
                                        <div class="lastname mb-3">
                                            <label class="text-primary" for="lastname">Last name</label>
                                            <input id="lastname" class="form-control editable" type="text" value=${data[0].last_name} disabled>
                                        </div>

                                    </div>
                                    <div class="col-md-5 mb-3">
                                        <div class="birthday mb-3">
                                            <label class="text-primary" for="birthday">Birthday</label>
                                            <input id="birthday" class="form-control editable" type="date" value=${data[0].dateNaissance.split("T")[0]} disabled>
                                        </div>
                                        <div class="address mb-3">
                                            <label class="text-primary" for="address">Address</label>
                                            <textarea id="address" class="form-control editable autosize" type="text" value disabled>${data[0].localAdress}</textarea>
                                        </div>
                                        <div class="phone">
                                            <label class="text-primary" for="phone">Phone</label>
                                            <input id="phone" class="form-control editable" type="text" value=${data[0].phoneNumber} disabled>
                                        </div>
                                    </div>
                                    <div class="d-none" id="message-confirm">
                                    <div class="me-3"><i class="flaticon-check"></i></div>
                                    <div>message</div>
                                </div>`; 
        
           }
           else
           
           {
                  let user = new User_data('findbywalletid/' + window.localStorage.getItem('userWalletAddress'))     
                  const data = await user.getData();
                  console.log(data);
                  
                                   
              
                         document.getElementById("updateaccount").innerHTML = `                    <div class="col-md-3 mb-3">
                                        <div class="userpicture">
                                            <img class="user-profil-avatar" src="./assets/img/lorem-portrait.jpg" alt="user-avatar">
                                            <label class="add-visual" id="userpicture">
                                                <input name="userpicture" accept="image/jpeg, image/webp, image/png" type="file" class="d-none">
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="username mb-3">
                                            <label class="text-primary" for="username">Display name</label>
                                            <input id="username" class="form-control editable" type="text" value=${data[0].nickname} disabled>
                                        </div>
                                        <div class="firstname mb-3">
                                            <label class="text-primary" for="firstname">First name</label>
                                            <input id="firstname" class="form-control editable" type="text" value=${data[0].first_name} disabled>
                                        </div>
                                        <div class="lastname mb-3">
                                            <label class="text-primary" for="lastname">Last name</label>
                                            <input id="lastname" class="form-control editable" type="text" value=${data[0].last_name} disabled>
                                        </div>

                                    </div>
                                    <div class="col-md-5 mb-3">
                                        <div class="birthday mb-3">
                                            <label class="text-primary" for="birthday">Birthday</label>
                                            <input id="birthday" class="form-control editable" type="date" value=${data[0].dateNaissance.split("T")[0]} disabled>
                                        </div>
                                        <div class="address mb-3">
                                            <label class="text-primary" for="address">Address</label>
                                            <textarea id="address" class="form-control editable autosize" type="text" value=${data[0].localAdress} disabled></textarea>
                                        </div>
                                        <div class="phone">
                                            <label class="text-primary" for="phone">Phone</label>
                                            <input id="phone" class="form-control editable" type="text" value=${data[0].phoneNumber} disabled>
                                        </div>
                                    </div>
                                    <div class="d-none" id="message-confirm">
                                    <div class="me-3"><i class="flaticon-check"></i></div>
                                    <div>message</div>
                                </div>`; 
        
           }
     }

}
app();