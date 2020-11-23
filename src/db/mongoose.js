const mongoose = require("mongoose");



mongoose.connect('mongodb://127.0.0.1:27017/mongodb-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});





//app.use(express.json()) - Parses json into an object

// req.body will replace hard coded object in new User instance

/*  app.post("/users",(req,res)=>{
    const user = new User(req.body);
})*/

/*const user = new User({
    name: "Mike Jordan",
    age: 45
});*/



