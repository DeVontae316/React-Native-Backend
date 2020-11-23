const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const Pickup = require("../models/pickup");
const router = require("../routers/pickup");
dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});


exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.secure_url,
                id: result.public_id,
            })
        }, {
            resource_type: "auto",
            folder: folder
        }
        )
    })
}

