'use strict';
const merchant_profile = require('../models/merchant_profile.model');
exports.findAll = function(req, res) {
    merchant_profile.findAll(function(err, merchant_profile) {
      console.log('controller')
      if (err)
        res.send(err);
        
      else
      
      {
                
              console.log('res', merchant_profile);
              const filters = req.query;
        
              const filteredUsers = merchant_profile.filter(user => {
                  let isValid = true;
                  for (var key in filters) {
                            
                            var keys_filr = filters[key].toString().split(',');
                           
                           if(key==="created_at")
                              {
                                  const date1 = new Date(keys_filr[0].toString());
                                  const date2 = new Date(keys_filr[1].toString());
                                  const date_user = new Date(user[key].toString());
                                  
                                  isValid = isValid && (date_user.getTime() >= date1.getTime() && date_user.getTime() <= date2.getTime());
                                  
                              }
                              
                            else if(key==="search")
                            {
                                var desci = user["description"].toString().search(keys_filr[0].toString());
                                var value = false;
                                if (desci >= 0)
                                    value = true;
                                else
                                    value = false;
                                isValid = isValid && (value);
                            }
                           
                           else
                           
                                 isValid = isValid && (keys_filr.includes(user[key].toString()));
                                
                            
                            
                        }
                  return isValid;
                       
               });
            
            res.send(filteredUsers);
            //res.send(merchant_profile);
            
        }
            
        
    });
            
    
};

exports.create = function(req, res) {
    const new_merchant_profile = new merchant_profile(req.body);
    //handles null error
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        merchant_profile.create(new_merchant_profile, function(err, merchant_profile) {
          if (err)
          res.send(err);
          res.json({error:false,message:"merchant_profile added successfully!",data:merchant_profile});
        });
    }
};

exports.findByWebsite = function(req, res) {
    merchant_profile.findByWebsite(req.params.website, function(err, merchant_profile) {
      if (err)
      res.send(err);
      res.json(merchant_profile);
    });
};

exports.update = function(req, res) {
    
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        merchant_profile.update(req.params.id, new merchant_profile(req.body), function(err, merchant_profile) {
            if (err)
                res.send(err);
            res.json({ error:false, message: 'merchant_profile successfully updated' });
       });
    }
};

exports.delete = function(req, res) {
    merchant_profile.delete( req.params.id, function(err, merchant_profile) {
      if (err)
      res.send(err);
      res.json({ error:false, message: 'merchant_profile successfully deleted' });
    });
};