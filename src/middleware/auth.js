const jwt = require("jsonwebtoken");
const User = require("../models/user");



const auth = async (req, res, next) => {

    try {
        const token = req.header("Authorization").replace('Bearer ', '');
        const verifiedToken = jwt.verify(token, "Test");

        //console.log(verifiedToken);

        const user = await User.findOne({ _id: verifiedToken._id, 'tokens.token': token })

        if (!user) {
            throw new Error();
        }
        req.user = user
        req.token = token
        next();

    }
    catch (error) {
        res.status(401).send({ error: "Please Authenticate" })
    }




}
/*
Algorithm:

Retrieve token.
Check the id of the owner.
Verify a user exist with this id and token.
*/

/*
    When users get obtain a token, it's signed with their id.
*/
module.exports = auth;