const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b94b675fa8d7862534c1be5')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((err) => {
    //     console.log('Unable to update document', err);
    // }, (result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b939268023ed950e5a4ba4d')
    }, {
        $set: {
            name: 'Danny'
        },
        $inc: {
            age: 3
        }
    }, {
        returnOriginal: false
    }).then((err) => {
        console.log('Unable to update document', err);
    }, (result) => {
        console.log(result);
    });

//    client.close();
});