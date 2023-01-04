       
function errorMessage() {
    
     var error = document.getElementById("error");
     
     var msg = fetch("/merchant_review/registred",{
                              method:"POST",
                              headers: {
                                "Content-Type":"application/json"
                              }
                            
                            }).then(function(val){
                                
                        error.innerHTML = "<span style='color: red;'>"+ "val" + "</span>";
              console.log(val);
      });
  
}
                          