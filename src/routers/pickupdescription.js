const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Description = require("../models/pickupdescription");

router.post("/description", auth, async (req, res) => {

    try {
        const description = await new Description({
            ...req.body,
            owner: req.user._id,
        }).save()

        res.status(202).send(description);

    } catch (error) {
        res.status(404).send({ error });
    }

});

router.get("/description", auth, async (req, res) => {
    try {
        await req.user.populate("description").execPopulate();
        res.send(req.user.description);

    } catch (error) {
        res.status(400).send({ error });
    }
})


module.exports = router;