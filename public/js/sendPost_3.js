export class ProductReviewStorage {
    
constructor(i) {

    $(function() {
    const baseURL = 'https://dev.veritatrust.com/product_review/registred';
    var testResponse;
    
    $("#product_form"+i.toString()).on('submit', function(event)
    {
       event.preventDefault();
      
        
       const btn = document.getElementById("btn");
       var contentInput = document.getElementById("content"+i.toString()).value;
       var titreInput = document.getElementById("titre"+i.toString()).value;
       var dateInput = document.getElementById("date"+i.toString()).value;
       
       
        const input = document.querySelector('#image'+i.toString());
        const file = input.files[0];
        const files = input.files;
        for(var item = 0; item < files.length; item++)
        {
            files[item] instanceof File;
            files[item] instanceof Blob;
        }
        
        file instanceof File; // true
        file instanceof Blob; // true
    
       
       
       
       const wallet_id = $("#wallet-address").text();
      
       var ratingInput = 0;
       var userId = 0;
       var merchantID= "";
        
          ratingInput =  $("#review-value"+i.toString()).text();   
          dateInput = dateInput + " 00:00:00";
          
        console.log(dateInput);
         const url_hash = $("#url-value").text();
  
        const a = url_hash.split('?')[1];
        //const queryString = window.location.search;
       /* const urlParams = new URLSearchParams(queryString);
        const jobId = urlParams.get('jobId');
        const userid = urlParams.get('userid');
        const orderid = urlParams.get('orderid');
        const productid = urlParams.get('productid').split(',');
        const website = urlParams.get('website');
        const product_name = urlParams.get('name').split(','); */
        
        const jobId = a.split('&')[0].split('=')[1]; //urlParams.get('jobId');
        const userid = a.split('&')[1].split('=')[1]; //urlParams.get('userid');
        const orderid = a.split('&')[3].split('=')[1];
        const productid = a.split('&')[4].split('=')[1].split(',');
        const website = a.split('&')[2].split('=')[1]; //urlParams.get('website');
        const product_name = a.split('&')[6].split('=')[1].split(',');
        
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
            
            
            const formData = new FormData();
            formData.append('rating', ratingInput);
            formData.append('title', titreInput);
            formData.append('experience_date', dateInput);
            formData.append('order_id', orderid);
            formData.append('product_id', productid[i]);
            formData.append('product_name',product_name[i]);
            formData.append('created_at', "");
            formData.append('updated_at', "");
            formData.append('statu', "pending");
            formData.append('job_id', jobId);
            formData.append('user_id', userid);
            formData.append('merchant_id', jobId);
            formData.append('content', contentInput);
            
            
            if(input.files.length > 0)
            {
                for(var k = 0; k < files.length; k++)
                        formData.append('image'+k.toString(),files[k]);
            }
            
            // Post the form, just make sure to set the 'Content-Type' header
            const res =  axios.post(baseURL, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(res => {
                      console.log(res)
                      var error = document.getElementById("error"+i.toString());
                      
                      if (res.data == "<span style='color: red';>"+ "Your opinion has not been considered!"+"</span>")
                            error.innerHTML = `<div class="callout callout-error"> Your opinion has not been considered! </div>`;
                      else
                      {
                   
                           // sucess_message.innerHTML = "<div>"+ "Product review has been registred" + "</div>";
                           error.innerHTML = `<div class="callout callout-success"> Product review has been registred</div>`;
                         //window.location = res.data.redirectUrl
                          
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
    
    }

}

let container = document.querySelector("#productreviews");
let product_review_bloc = container.querySelectorAll("div.form__header");

const productReviewArray = Array.from(product_review_bloc);

var i = 0;

productReviewArray.forEach(div => {
    
    var reviewStorage = new ProductReviewStorage(i);
    
    i = i + 1;
    
});