
$(function() {
const baseURL = 'https://dev.veritatrust.com/product_review/registred';
var testResponse;

$("#product_form").on('submit', function(event)
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
   
   const wallet_id = $("#wallet-address").text();
  
   var ratingInput = 0;
   var userId = 0;
   var merchantID= "";

    /*  if(star1.checked)
         ratingInput = 1;
      else if(star2.checked)
         ratingInput = 2;

      else if(star3.checked)
         ratingInput = 3;

      else if(star4.checked)
         ratingInput = 4;

      else if(star5.checked)
         ratingInput = 5; */
    
      ratingInput =  $("#review-value").text();   
      dateInput = dateInput + " 00:00:00";
      
    console.log(dateInput);
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const jobId = urlParams.get('jobId');
    const userid = urlParams.get('userid');
    const orderid = urlParams.get('orderid');
    const productid = urlParams.get('productid');
    const website = urlParams.get('website');
    
    var get_url = "https://dev.veritatrust.com/user_profile/";
    var URL = get_url.concat(wallet_id);
    console.log(wallet_id);
     
   // var my_token = hcaptcha.getResponse();
   
    axios.get('https://dev.veritatrust.com/merchant_profile/'+website) // Update 15-08-2022 add
      
   .then(function (resp) {
       
    merchantID = resp.data[0].id;
    
    axios.get(URL)
      .then(function (response) {
        console.log(response.data[0].id);
        console.log(wallet_id);
        userId = response.data[0].id;

        axios.post(baseURL, {

                  rating: ratingInput,
                  title: titreInput,
                  experience_date :dateInput,
                  order_id :  orderid,
                  product_id: productid,
                  created_at :"",
                  updated_at:"",
                  statu: "pending",
                  job_id : jobId,
                  user_id :userid,
                  merchant_id :merchantID,
                  content: contentInput
                 
               })
               .then(res => {
                  console.log(res)
                  var error = document.getElementById("error");
                  
                  if (res.data == "<span style='color: red';>"+ "Your opinion has not been considered!"+"</span>")
                        error.innerHTML = `<div class="callout callout-error"> Your opinion has not been considered! </div>`;
                  else
                  {
               
                       // sucess_message.innerHTML = "<div>"+ "Product review has been registred" + "</div>";
                     //   error.innerHTML = "";
                      window.location = res.data.redirectUrl
                      
                  }
                
                
               });
               
      
        });
      
   });


   })
   .catch(function (error) {
     // handle error
     if (error.response) 
          console.log(error.response.data);

   });
   

});

  
