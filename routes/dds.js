var express = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
//var db = mongojs('mydb', ['mycollection'])
//in general collections should be lowercase and plural
var db = mongojs('db', ['todos']);

/* GET ALL ITEMS IN COLLECTION
 find everything
db.mycollection.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
})
*/
router.get('/todos', function(req, res, next) {
   db.todos.find(function(err, todos) {
       if (err) {
           console.log('ERR IN /TODOS GET')
           res.send(err);
       } else {
           console.log('JSON IN /TODOS GET')
           res.json(todos);
       }
   });
});

/*Get one collection item with the provided ID */
router.get('/todo/:id', function(req, res, next) {
   db.todos.findOne({
       _id: mongojs.ObjectId(req.params.id)
   }, function(err, todos) {
       if (err) {
           res.send(err);
       } else {
           res.json(todos);
       }
   });
});

/* POST/SAVE a todo */
router.post('/todo', function(req, res, next) {
   var todo = req.body;
    if (!todo.text || !(todo.isCompleted + '')) {
        res.status(400);
        res.json({
           "error": "Invalid Data"
        });
    } else {
        db.todos.save(todo, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        })
    }
});
/* PUT/UPDATE a todo */
router.put('/todo/:id', function(req, res, next) {
    var todo = req.body;
    var updObj = {};

    if (todo.isCompleted) {
        updObj.isCompleted = todo.isCompleted;
    }
    if (todo.text) {
        updObj.text = todo.text;
    }

    if (!updObj) {
        res.status(400);
        res.json({
           "error": "Invalid Data"
        });
    } else {
        db.todos.update({
            _id: mongojs.ObjectId(req.params.id)
        }, updObj, {}, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }

});

/* DELETE a todo */
router.delete('/todo/:id', function(req, res) {
   db.todos.remove({
      _id: mongojs.ObjectId(req.params.id)
   }, '', function(err, result) {
       if (err) {
           res.send(err);
       } else {
           res.json(result);
       }
   });
});

module.exports = router;