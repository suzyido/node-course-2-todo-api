const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Something to do'}).then((result) => {
    //     console.log('Deleting documents');
    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err) => {
    //     if(err) {
    //         console.log('Failed deleting document', err);
    //     }
    // });
    
    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
    //     console.log('Deleting documents');
    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err) => {
    //     if(err) {
    //         console.log('Failed deleting document', err);
    //     }
    // });

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b9392a85c1a3e50fcf689d1')}).then((result) => {
        console.log(result);
    }, (err) => {
        if(err) {
            console.log('Failed to delete document', err);
        }
    })

//    client.close();
});