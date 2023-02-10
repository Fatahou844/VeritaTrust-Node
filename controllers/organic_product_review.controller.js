'use strict';
const db = require('../models/index')
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
cloudinary.config({ 
    cloud_name: 'dnbpmsofq', 
    api_key: '369583817998179', 
    api_secret: 'yNX8NjrsLYJ7u96J9MW6XBAUIJg' 
  });

const organic_product_review = db.organic_product_review;

const uploadImage = (path) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(path, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      });
    });
  };


exports.findAll = function(req, res) {
    organic_product_review.findAll(req.query.page ,req.query.site, function(err, organic_product_review) {
      console.log('controller')
      if (err)
        res.send(err);
        
      console.log('res', organic_product_review);
     // res.send(organic_product_review);
     
     const filters = req.query;
     const filteredUsers = organic_product_review.filter(user => {
        let isValid = true;
        for (var key in filters) {
          
          var keys_filr = filters[key].toString().split(',');
          if(key == 'rating')
                isValid = isValid && (keys_filr.includes(user[key].toString()));
                
        }
        return isValid;
      });
     
     res.render('pages-review',  { title: 'All reviews', productReviews: filteredUsers, webproduct: req.query.site});
    });
};

/*exports.create = function(req, res) {
    const new_organic_product_review = new organic_product_review(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        organic_product_review.create(new_organic_product_review, function(err, organic_product_review) {
          if (err)
          res.send(err);
          res.json({error:false,message:"organic_product_review added successfully!",data:organic_product_review});
        });
    }
};
*/

exports.create_product_org = function(req, res) {

  const form = new formidable.IncomingForm();
  // Parse `req` and upload all associated files
  form.parse(req, function(err, fields, files) {
   if (err) {
      return res.status(400).json("server error for data incomming [product review]");
    } 
        console.log(fields["content"]);
        var image = "";
   
        if(files !== null)
        {
        
        
            for (var key in files) {
            
                 image = image + "," + files[key]["filepath"]; 
                    
            }
            
            image = image.substring(1); // Suppression du premier virgule

            uploadImage(image)
                    .then((url) => {
                        console.log(`Image uploaded to: ${url}`);
                               //create productreview
            organic_product_review.create({
                product_name: fields["product_name"],
                rating: fields["rating"],
                title: fields["title"],
                experience_date: fields["experienceDate"],
                content: fields["content"],
                merchant_id: "4f6750685-6ee7-49dd-b9e8-1f204b13db6a",
                image_video: image
                
                }).then((product) => {
                //if user created, send success
                if (product) {
                    res.status(200).send('organic product review created successfully');
                }
                //if user not created, send error
                else {
                    res.status(400).send(' not created');
                }
    
                })
                    })
                    .catch((error) => {
                        console.error(error);
                    });
        }
            
            
        else
        {
            image = null; 
            //create productreview
            organic_product_review.create({
            product_name: fields["product_name"],
            rating: fields["rating"],
            title: fields["title"],
            experience_date: fields["experienceDate"],
            content: fields["content"],
            merchant_id: "4f6750685-6ee7-49dd-b9e8-1f204b13db6a",
            image_video: image
            
            }).then((product) => {
            //if user created, send success
            if (product) {
                res.status(200).send('organic product review created successfully');
            }
            //if user not created, send error
            else {
                res.status(400).send(' not created');
            }

            })
    }

 });

};

exports.findById = function(req, res) {
    organic_product_review.findById(req.params.id, function(err, organic_product_review) {
      if (err)
      res.send(err);
      res.json(organic_product_review);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        organic_product_review.update(req.params.id, new organic_product_review(req.body), function(err, organic_product_review) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'organic_product_review successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    organic_product_review.delete( req.params.id, function(err, organic_product_review) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'organic_product_review successfully deleted' });
    });
};