
//var request = require('request');


$(function() {
//const baseURL = 'https://localhost:8009/merchant_review/registred';
const baseURL = 'https://dev.veritatrust.com/merchant_review/registred';
var testResponse;

//window.onload=function()
$("#review_form").on('submit', function(event)
{
   event.preventDefault();
   const btn = document.getElementById("btn");
  /* var star1 = document.getElementById("star-1");
   var star2 = document.getElementById("star-2");
   var star3 = document.getElementById("star-3");
   var star4 = document.getElementById("star-4");
   var star5 = document.getElementById("star-5"); */

   var contentInput = document.getElementById("content").value;
   var titreInput = document.getElementById("titre").value;
   var dateInput = document.getElementById("date").value;
   
  //const wallet_id = document.getElementById('wallet-address'); //document.querySelector('.desc');
   
   const wallet_id = $("#wallet-address").text();
   
   const url_hash = $("#url-value").text();
   

   var userId = 0;
   var merchantID= "";

     /* if(star1.checked)
         ratingInput = 1;
      else if(star2.checked)
         ratingInput = 2;

      else if(star3.checked)
         ratingInput = 3;

      else if(star4.checked)
         ratingInput = 4;

      else if(star5.checked)
         ratingInput = 5; */
    
      
    var ratingInput =  $("#review-value").text();
    dateInput = dateInput + " 00:00:00";
      
    console.log("ratingInput");
    console.log(ratingInput);
    
    const queryString = url_hash.split('?')[1]; //window.location.search.split('?')[1];
   
    const urlParams = new URLSearchParams(window.location.search);
    var a = CryptoJS.enc.Base64.parse(queryString).toString(CryptoJS.enc.Utf8);
    
    const jobId = a.split('&')[0].split('=')[1]; //urlParams.get('jobId');
    const userid = a.split('&')[1].split('=')[1]; //urlParams.get('userid');
    const orderid = a.split('&')[3].split('=')[1];
    const productid = a.split('&')[4].split('=')[1];
    const website = a.split('&')[2].split('=')[1]; //urlParams.get('website');
    
    const redirectUrl = "https://dev.veritatrust.com/preview?id="+urlParams.get('id');

   // btn.addEventListener("submit", async (event) => {
    // event.preventDefault();
     var get_url = "https://dev.veritatrust.com/user_profile/";
     var URL = get_url.concat(wallet_id);
     console.log(wallet_id);
     
     var my_token = hcaptcha.getResponse();

    axios.get('https://dev.veritatrust.com/merchant_profile/'+website)
      
     .then(function (resp) {
         
     merchantID = resp.data[0].id;
    
     axios.get(URL)
      .then(function (response) {
        console.log(response.data[0].id);
        console.log(wallet_id);
        userId = response.data[0].id;
        
      // if(testResponse.length === 0)   
         {
            axios.post(baseURL, {

                  rating: ratingInput,
                  title: titreInput,
                  experience_date :dateInput,
                  order_id : orderid,
                  created_at :"",
                  updated_at:"",
                  statu: "pending",
                  job_id : jobId,
                  user_id :userid,
                  merchant_id :merchantID,
                  content: contentInput,
                  token: my_token,
                  product_id: productid,
                  website: website, 
                  redirectUrl: redirectUrl
              

               })
               .then(res => {
                  console.log(res)
                  var error = document.getElementById("error");
                  //error.innerHTML = "<div>"+ res.data + "</div>";
                  if(res.data=== "<span style='color: red';>"+ "captcha verification failed" + "</span>")
                        error.innerHTML = `<div class="callout callout-error">captcha verification failed</div>`; 
                  else if (res.data === "<span style='color: red';>"+ "Your opinion has not been considered!"+"</span>")
                        error.innerHTML = `<div class="callout callout-error">Your opinion has not been considered</div>`;
                  else
                  {
                        root.innerHTML = "<div>"+ res.data + "</div>";
                       // sucess_message.innerHTML = "<div>"+ "Merchant review registred successfully" + "</div>";
                        window.location = res.data.redirectUrl
                  }
                  hcaptcha.reset();
                 
                
               });
               
              
            
         }
      
      });

     });



   })
   .catch(function (error) {
     // handle error
     if (error.response) 
          console.log(error.response.data);
    /* else 
        console.log(error.message); */
   });
   

   });

  
