var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');


var app = express();

const post = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        if(err) {
            res.status(400).send(err);
        }
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
        if(err) {
            return res.status(400).send(err);
        }
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        console.log('Bad id');
        return res.status(400).send();
    }
    Todo.findById(id).then((todo) => {
        if(todo) {
            return res.send(todo);
        }
        res.status(404).send();
    }, (err) => {
        if(err) {
            return res.status(400).send();
        }
    });
});

if(!module.parent) { // This is here to avoid errors when running Mocha (double listening)
    app.listen(port, () => {
        console.log(`App started on port ${port}`);
    });
}

module.exports = {app};