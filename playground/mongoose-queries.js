const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b94e2533a58487a67d6399811';

if(!ObjectID.isValid(id)) {
    return console.log('ID is not valid', id);
}

Todo.find({
    _id: id
}).then((todos) => {
    if(todos.length === 0) {
        return console.log('ID not found', id);
    }
    console.log('Todos', todos);
}).catch((err) => console.log(err));

Todo.findOne({
    _id: id
}).then((todo) => {
    if(!todo) {
        return console.log('ID not found', id);
    }
    console.log('Todo', todo);
}).catch((err) => console.log(err));

Todo.findById(id).then((todo) => {
    if(!todo) {
        return console.log('ID not found', id);
    }
    console.log('Todo By ID ', todo);
}).catch((err) => console.log(err));

User.findById(id).then((user) => {
    if(!user) {
        return console.log('User not found', user);
    }
    console.log('User found with email', user.email);
});