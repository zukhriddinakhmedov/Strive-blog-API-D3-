import express from "express"
import multer from "multer"
import createHttpError from "http-errors"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { savePictures } from "../../library/fs-tools.js"

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, //automatically read CLOUDIANRY_URL from process.env.CLOUDINARY_URL
    params: {
        folder: "strive-blogposts"
    }
})

const filesRouter = express.Router()

filesRouter.post(
    "/uploadSingle/:id",
    multer({
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== "image/gif") cb(createHttpError(400, { errorList: "Format not supported" }), false)
            else cb(null, true)
        },
    }).single("blogPic"),
    async (req, res, next) => {
        // THIS ROUTE IS GOING TO RECEIVE A multipart/form-data-body,
        // therefore we should use multer to parse that body and give us back the file 
        try {
            console.log(req.file)

            await savePictures("photo_2021-09-09 13.55.12.gif", req.file.buffer)

            //1- read posts.json file
            //2- find the post by id
            //3- add img 
            //4- save the posts back posts.json file
            res.send("OK")
        } catch (error) {
            next(error)
        }
    }
)

filesRouter.post("uploadMultiple", multer({ storage: cloudinaryStorage }).single("blogPic"), async (req, res, next) => {
    try {
        console.log(req.file)
        res.send("Uploaded on cloudinary")
    } catch (error) {
        next(error)
    }
})

export default filesRouter