//Object returned
const mongodb = require("mongodb");

const { MongoClient, ObjectID } = require('mongodb');

//database name can be whatever you want
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'mongodb';

//MongoDB stores id as binary because they're twice as small than strings
/*const id = new ObjectID();
console.log(id.id.length);
console.log(id.toHexString().length);
console.log(id.getTimestamp());*/

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    //Asynchronous Callback function that will let us know if database connection has succeded
    if (error) {
        return console.log('Unable to connect to database');
    }
    console.log("connected");

    const db = client.db(databaseName);

    db.collection("user").deleteOne({
        _id: new ObjectID("5f4138de23ed765e77c8e41a"),
    }).then(result => { return console.log(result) })
        .catch(error => { return console.log(error) })

    /*db.collection("task").updateMany(
          {
              completed: false
          },
          {
              $set: {
                  completed: true
              }
          }).then((result) => { console.log(result.modifiedCount) })
          .catch((err) => { console.log(err) })
  */


    /*const update = async () => {
        const updateBob = await db.collection("user").updateOne({
            _id: new ObjectID("5f41460b70c5705f74f83eaa"),
        }, {
            $set: {
                name: "Jantu",
                age: 23,
            }
        })
        return console.log(updateBob);
    }
    update();*/

    /*db.collection("user").find({ name: "Bob" }).toArray(
        (errors, user) => {
            if (errors) {
                return console.log(errors);
            }
            console.log(user);
        }
    );*/

    /*db.collection("task")
        .find({ _id: new ObjectID("5f4149dcf4546a5fd72c5d63") })
        .toArray((error, results) => {
            if (error) console.log(error);
            console.log(results);
        })*/

    /*db.collection("task").find({ completed: false }).toArray((error, results) => {
        if (error) console.log(error);
        console.log(results)
    })*/

    /*db.collection("user").insertOne({ name: "Willy", age: 33 }, (error, results) => {
        if (error) console.log(error);
        console.log(results);
    })*/


    //Retrieves a reference to mongo databse if connection was successful 
    /*db.collection("user").insertOne({
         name: "Bob",
         age: 32,
     }, (error, result) => {
         if (error) {
             return console.log("error" + ' ' + error)
         }
 
         console.log(result.ops);
     });*/

    //gui id's are waht allow MongoDB to be scalable 
    // With an auto incrementing integer, like SQL, it's possible to have users with the same i.d.

    /*db.collection("task").insertMany([
         {
             description: "Clean bathroom",
             completed: false,
         },
         {
             description: "Read bible",
             completed: false,
         },
         {
             description: "Workout",
             completed: false,
         },
 
     ], (errors, results) => {
         if (errors) {
             return console.log("Couldn't insert document");
         }
 
         console.log(results.ops);
     })*/


});

