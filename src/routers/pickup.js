const express = require("express");
const router = express.Router();
const Pickup = require("../models/pickup");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const Task = require("../models/task");
const cloudinary = require("../utils/cloudinary");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './avatars');

    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})



const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000,
    },
    fileFilter(req, file, cb) {
        if (file.originalname.endsWith(".jpg") || file.originalname.endsWith(".png")) {
            return cb(undefined, true);
        }
        cb(new Error("File extension must end in .jpg or .png"));
    }
})

router.post("/pickups", auth, upload.single("upload"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 200, height: 200 }).toBuffer();
    console.log("single file below");
    console.log(buffer);
    try {
        const pickup = await new Pickup({
            photo: buffer,
            owner: req.user.id,
        }).save()


        res.send(pickup.owner);


    } catch (error) {
        res.status(400).send({ error });
    }



}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.post("blah/blah", auth, upload.array("upload", 2), async (req, res) => {
    const upload = async (path) => await cloudinary.upload(path, "filename");

    if (req.method === "POST") {
        const arr = [];
        const files = req.files;
        for (file of files) {
            const { path } = file;
            const res = await upload(path);
            arr.push(path);
        }

        const pickup = new Pickup({
            ...req.body,
            photo: [arr[0].url, arr[1].url],
            owner: req.user._id
        })
    }


})
router.post("/multiple_pickups", auth, upload.array("upload", 2), async (req, res) => {
    const upload = async (path) => await cloudinary.uploads(path, "pickups")
    console.log(req.files[0].path + '  path goes here...')
    console.log(req.files);
    console.log("req.body below");
    console.log(req.body);
    if (req.method === "POST") {

        let arr = [];
        let files = req.files;
        for (const file of files) {
            const { path } = file;
            const res = await upload(path);
            arr.push(res);
        }
        let pickup = await new Pickup({
            ...req.body,
            photo: [arr[0].url, arr[1].url],
            owner: req.user._id,


        }).save()


        res.status(200).send({
            message: 'images uploaded successfully',
            data: arr,
            pickup,
        })



    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});
// pickup/limit=5&skip=5

router.get("/total", auth, async (req, res) => {
    await req.user.populate("pickup").execPopulate();

    res.send({ total: req.user.pickup.length });
})
router.get("/pickup", auth, async (req, res) => {
    try {
        await req.user.populate({
            path: "pickup",
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    createdAt: -1
                }

            }
        }).execPopulate();
        //res.set("Content-Type", "image/png");
        console.log("Total below...");
        console.log(req.user.pickup.length);
        console.log("All user pickups below");
        res.send(req.user.pickup);


    } catch (error) {
        res.status(404).send({ error });
    }
})
//pickups?label=furniture
router.get("/pickups", async (req, res) => {

    try {
        const label = {};
        if (req.query.label) {
            label.label = req.query.label
        }
        //console.log(label);
        const allPickups = await Pickup.find(label).sort({
            label: 1
        }).limit(5);
        if (allPickups.length !== 0) {
            return res.send(allPickups);
        }
        res.send({ error: "Unable to retrieve items" })

    } catch (error) {
        res.status(404).send([{ error: "We're sorry! We're unable to handle your request" }])
    }
})

module.exports = router;

