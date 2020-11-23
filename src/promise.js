require('./db/mongoose');
const User = require("./models/user");
const Task = require("./models/task");
const { countDocuments, findOneAndUpdate } = require('./models/user');
const bcrypt = require("bcryptjs");

/*const add = (a, b) => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            resolve(a + b);
        }, 2000)
    })
}

const subtract = (x, y) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(x - y);
        }, 5000)
    })
}
subtract(100, 10).then(total => {
    console.log(total)
    return subtract(total, 10)
        .then(secondtotal => console.log(secondtotal))
        .catch(e => console.log(e));
})*/

/*const hashed = async () => {
    let password = "123";
    let hash = await bcrypt.hash(password, 8);

    console.log(password);
    console.log(hash);

    let auth = await bcrypt.compare("1234", hash);

    switch (auth) {
        case true:
            console.log("true");
            break;
        case false:
            console.log("false");
            break;

        default:
            console.log("default");
    }
}*/

/*const obj = {
    name: "Billy",
    password: "12$%33ffdcd2wr",
    tokens: [
        {
            id: "dddsssssssss"
        }
    ],
    token: "23ddssss.ggggg.56666",
}

obj.toJSON = function () {
    delete this.tokens;
    delete this.password;
    return this;
}*/
/*onst stringfy = JSON.stringify(obj);

console.log(stringfy);*/

// JSON.stringfy gets called behind the scens when we use res.send()
// toJSON gets called when JSON.stringfy gets called.

//hashed();

/*Task.findByIdAndUpdate("5f464323a57785932c591eeb", { completed: true })
    .then(res => console.log(res))
return Task.countDocuments({ completed: true })
    .then(res => console.log(res))
    .catch(e => console.log(e));*/

/*const findAndUpdate = async () => {
    try {
        const updateTask = await Task.findByIdAndRemove("5f464323a57785932c591eeb");
        console.log(updateTask)
        const howManyTaskNotCompleted = await Task.countDocuments({ completed: false });
        console.log(howManyTaskNotCompleted);
    } catch (error) {
        console.log(error)
    }
}*/

//findAndUpdate();
/*What is the difference between findByIdAndUpdate and update?
    findByIdAndUpdate will return document:{}
    update will not: x

We use findByIdAnd Update with countDocuments via chain promising
to find out how many users have a specific age


*/
/*add(5, 5)
    .then(sum => {
        console.log(sum);
        return add(sum, 5)
            .then(anotherSum => {
                console.log(anotherSum);
                return add(5, 0)
                    .then(total => {
                        console.log(total);
                    }).catch(e => console.log(e));
            })
    })*/

/*const testAsync = async () => {

    const one = await add(5, 5);
    console.log(one);
    const two = await add(one, 5);

    console.log(two);
}

testAsync();*/