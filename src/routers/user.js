const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require('sharp');


const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (file.originalname.endsWith(".jpg") || file.originalname.endsWith(".png")) {
            cb(undefined, true);
        } else {
            cb(new Error("Must be a .png or .jpg extension"));
        }
    }
})

router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(req.user);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

router.patch("/users/me/d_avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send(req.user);
})

//My signup router. I need to send token via "sendToken function I created for my login router"
router.post("/users", async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedInputs = ["name", "email", "password",];
    const allowed = keys.every(i => allowedInputs.includes(i));

    if (!allowed) {
        res.status(404).send({ error: "Not allowed" });
    }

    try {
        const user = await new User(req.body).save();
        console.log(req.body);
        const token = await user.sendToken();
        if (!user) {
            return res.status(404).send({ error: "Something went wrong with posting your data!" })
        }
        res.status(202).send({ user, token });
    } catch (error) {
        return res.status(500).send({ error: "Couldn't post user to database" });
    }
});


router.post("/users/login", async (req, res) => {
    try {

        const user = await User.verifyUserCredentials(req.body.email, req.body.password);
        const token = await user.sendToken();
        console.log(user);
        console.log("user above");
        res.send({ user, token });

    }
    catch (error) {
        res.send({ error: "Error...please check email or password" })
    }

})
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});



router.post("/users/logout", auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send()

    } catch (error) {
        res.status(500).send({ error: "Something went wrong logging out" })
    }


});


router.post("/users/logoutall", auth, async (req, res) => {

    try {
        req.user.tokens = [];

        await req.user.save();
        res.send();

    }
    catch (error) {
        res.status(500).send({ error });
    }
})



router.patch("/users", auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const updates = ["name", "password", "age", "email"];

    //const user = User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    try {


        keys.forEach(update => {
            return req.user[update] = req.body[update]
        });

        await req.user.save();

        res.send(req.user);

    } catch (error) {
        res.status(500).send({ error });
    }


})

router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);

    } catch (error) {
        res.status(500).send({ error });
    }


})

//Admin priveleges below

router.get("/users/:id", async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const keys = Object.keys(req.body);

    const areUpdatesAllowed = keys.every(updates => {
        return allowedUpdates.includes(updates);
    });

    if (!areUpdatesAllowed) {
        res.send({ error: "Updates are not allowed" });
    }
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ error: "User not found" })
        }
        res.status(202).send(user);
    } catch (error) {
        res.status(500).send({ error: "Uh oh. Couldn't compelete request. Check async/await function!" });
    }
});

router.patch("/users/:id", async (req, res) => {
    const request = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "age", "password",]
    const validateUpdates = request.every(update => {
        return allowedUpdates.includes(update);
    })



    if (!validateUpdates) {
        res.status(400).send({ error: "Can't update those fields " });
    }
    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const user = await User.findById(req.params.id);
        console.log("id below")
        console.log(req.params.id);
        request.forEach(i => user[i] = req.body[i]);

        await user.save();


        if (!user) {
            return res.status(404).send({ error: "User not found for update" })
        }

        res.send(user);

    } catch (error) {
        res.status(500).send({ error: "Couldn't complete request!" });
    }
});


router.delete("/users/:id", (req, res) => {
    const user = User.findByIdAndRemove(req.params.id);
    user.then(removedUser => {
        if (!removedUser) {
            return res.status(404).send({ error: "Can't remove user from database!" })
        }
        return res.status(200).send(removedUser)
    }).catch(e => res.status(500).send({ error: e }))
})

module.exports = router