const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b93915527f5be4fcf0dee66') 
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     if(err) {
    //         console.log('Unable to fetch todos', err);
    //     }
    // });

    db.collection('Todos').find().count().then((count) => {
        console.log('Todos');
        console.log(`todos: ${count}`);
    }, (err) => {
        if(err) {
            console.log('Unable to fetch todos', err);
        }
    });   

//    client.close();
});