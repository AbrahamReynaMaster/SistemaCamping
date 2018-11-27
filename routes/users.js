var express = require('express');
var router = express.Router();

/* GET userlist. */
router.get('/talentos', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* GET Last Casita. */
router.get('/campingdisponible', function(req, res) {
  var db = req.db;
  var collection = db.get('camping');
  collection.findOne({'disponible':'true'},{},function(e,docs){
    res.json(docs);
  });
});

/* Get Numero de casas disponibles */
router.get('/campingcount', function(req, res) {
  var db = req.db;
  var collection = db.get('camping');
  collection.count({'disponible':'true'},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to adduser. */
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* POST to adduser. */
router.post('/adduser', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* POST to addcasitas. */
router.post('/addcasitas', function(req, res) {
  var db = req.db;
  var collection = db.get('camping');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* Update User Camping */
router.put('/AsignaCamping/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  var collection2 = db.get('camping');
  var userid = req.body.idUser;
  var campingasignado = req.body.casita;
  collection.update({'_id': userid}, { $set: { 'camping' : campingasignado}},{upsert: true}, function(err, result){
    //res.send(
    //  (err === null) ? { msg: '' } : { msg: err }
    //);
  });
  collection2.update({'numero': campingasignado},{ $set: { 'disponible' : 'false'}},{upsert: true}, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* Asigna El camping */
router.put('/AsignaCampingCompartido', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  var collection2 = db.get('camping');
  var useridone = req.body.idUserone;
  var useridtwo = req.body.useridtwo;
  var campingasignado = req.body.casita;
  collection.update({'_id': useridone}, { $set: { 'camping' : campingasignado}},{upsert: true}, function(err, result){
    //res.send(
    //  (err === null) ? { msg: '' } : { msg: err }
    //);
  });
  collection.update({'_id': useridtwo}, { $set: { 'camping' : campingasignado}},{upsert: true}, function(err, result){
    //res.send(
    //  (err === null) ? { msg: '' } : { msg: err }
    //);
  });
  collection2.update({'numero': campingasignado},{ $set: { 'disponible' : 'false'}},{upsert: true}, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* Asigna El camping */
router.put('/AsignaCampingIndividual', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  var collection2 = db.get('camping');
  var useridone = req.body.idUserone;
  var campingasignado = req.body.casita;
  collection.update({'_id': useridone}, { $set: { 'camping' : campingasignado}},{upsert: true}, function(err, result){
    //res.send(
    //  (err === null) ? { msg: '' } : { msg: err }
    //);
  });
  collection2.update({'numero': campingasignado},{ $set: { 'disponible' : 'false'}},{upsert: true}, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* Asigna El camping */
router.put('/LiberaCamping', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  var collection2 = db.get('camping');
  var campingasignado = req.body.casita;
  collection.update({'camping': campingasignado}, { $unset: { 'camping': "" }}, function(err, result){
    //res.send(
    //  (err === null) ? { msg: '' } : { msg: err }
    //);
  });
  collection2.update({'numero': campingasignado},{ $set: { 'disponible' : 'true'}},{upsert: true}, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE to deleteuser. */
router.delete('/deleteuser/:id/:casa', function(req, res) {
  var db = req.db;
  var collection = db.get('talentos');
  var collection2 = db.get('camping');
  var userToDelete = req.params.id;
  var campingReasign = req.params.casa;
  collection.remove({ '_id' : userToDelete }, function(err) {
    //res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
  collection2.update({'numero': campingReasign},{ $set: { 'disponible' : 'true'}},{upsert: true}, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});


module.exports = router;