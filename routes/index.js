var express = require('express');
var router = express.Router();
fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Home' });
});

router.get('/adduser',function (req,res,next){
  fs.readFile('public/addUser.html', function (err, html) {
    if (err) {
        console.log(err);
        return 
    }       
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(html);  
    res.end();  
    })
});

router.get('/getUsersCamping',function(req,res,next){
    /* GET userlist. */
    var db = req.db;
    var collection = db.get('user');
    collection.find({},{},function(e,docs){
      res.json(docs);
    });
})

router.use('/addUserSimple',function (req,res,next){
  var db = req.db;
  var collection = db.get('user');
  var email = req.param('email');
  collection.find({email: {$eq: email}},{},function(err,result){
    if(result.length >= 1){
      console.log("Si etsiste");
      var holi = checkCodeUsed("CMPT19E93422E9F39106C",req);
      console.log(holi);
      res.json({msg: "1"});
      res.end();
    }
    else{
      console.log("No etsiste");
      collection.insert(req.body, function(err, result){
        res.json(
          (err === null) ? { msg: "2" } : { msg: err }
        );
        res.end();
      });
    }
  })
})

function checkCodeUsed(code,req){
  var value = false;
  var db = req.db;
  var collection = db.get('codes');
  collection.find({_id: {$eq: code}},{},function(err,result){
    if(result[0].status == "used"){
      value = true
    }
    else{
      value = false
    }
    console.log("me timas: "+value);
    console.log("El codigo: "+result[0]._id+" está: "+result[0].status);
  });
  return value;
}


module.exports = router;
