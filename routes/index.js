var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Home' });
});

router.get('/adduser',function (req,res,next){
  res.json('addUser.html',{title: 'Add User'});
});

router.get('/getUsersCamping',function(req,res,next){
    /* GET userlist. */
    var db = req.db;
    var collection = db.get('user');
    collection.find({},{},function(e,docs){
      res.json(docs);
    });
})

module.exports = router;
