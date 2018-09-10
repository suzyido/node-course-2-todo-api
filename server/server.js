var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

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

if(!module.parent) { // This is here to avoid errors when running Mocha (double listening)
    app.listen(3000, () => {
        console.log('App started on port 3000');
    });
}
module.exports = {app};