const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const { findOne } = require("./task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,

    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Email must be valid");

        }

    },
    age: {
        type: Number,
        default: 0,
    },
    password: {
        type: String,
        unique: true,
        required: true,
        //minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) throw new Error("Password can't be part of your password");

        },
        trim: true,
        //lowercase: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer,
        //required: true,
    }
});
userSchema.virtual("description", {
    ref: "Description",
    localField: "_id",
    foreignField: "owner",
});
userSchema.virtual("pickup", {
    ref: "Pickup",
    localField: "_id",
    foreignField: "owner",
});
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner",
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

userSchema.methods.sendAuthToken = async function () {
    const user = this;

    const token = jwt.sign({ id: user._id.toString() }, "Can't know my secret");

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.methods.sendToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "Test");
    user.tokens = user.tokens.concat({ token });
    //Why route is considered a post
    await user.save();
    return token;


}

userSchema.statics.verifyUserCredentials = async (email, password) => {
    const user = await User.findOne({ email });


    if (!user) {
        throw new Error("Unable to process request");
    }

    const verifyCredentials = await bcrypt.compare(password, user.password);

    if (!verifyCredentials) {
        throw new Error("Unable to process to data")
    }

    return user;
}

userSchema.statics.findUserByCredentials = async (email, password) => {
    const findUserByEmail = await User.findOne({ email });
    if (!findUserByEmail) {
        throw new Error("Unable to login in");
    }

    const verifyUserPassword = await bcrypt.compare(password, findUserByEmail.password);

    if (!verifyUserPassword) {
        throw new Error("Unable to login");
    }

    return findUserByEmail;
}


/*
    
*/

//This is responsible for the create and update portion of C.R.U.D
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        const hash = await bcrypt.hash(user.password, 8);
        user.password = hash;

    }

    next();
    /*
        router.patch("/user/me",auth,async(req,res)=>{
            const keys = Obkect.keys(req.body);
            const updates = ["name","password","email"];
            
            try{
                const user = findOne({_id:req.user.id});

                if(!user){
                    res.status(404).send({error:"Request not found"});
                }

                keys.forEach(update => user[update] = req.body[update]);
                await user.save();

                
            }catch(error){
                res.status(500).send({error})
            }
        })
    */
});

userSchema.pre("remove", async function (next) {
    const user = this;
    const task = await Task.deleteMany({ owner: user._id });

    next();
})
/*userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    //console.log("Right before you save:" + this.password);
    next();
})*/

const User = mongoose.model('User', userSchema);

module.exports = User;
