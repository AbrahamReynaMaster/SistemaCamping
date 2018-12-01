var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../public/index.html', { title: 'Holi' });
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
