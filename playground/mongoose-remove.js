const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

 Todo.findOneAndRemove({_id: '5b97c4d290f40460c5f748f7'}).then((result) => {
    console.log(result);
 })

Todo.findByIdAndRemove('5b97c44d11561d608d315a69').then((result) => {
    console.log(result);
});