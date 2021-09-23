import path, { dirname, extname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import multer from "multer"

const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const publicDirectory = path.join(_dirname, "../../../public/img")

export const parseFile = multer()

export const uploadFile = (req, res, next) => {
    try {
        const { originalname, buffer } = req.file
        const extension = extname(originalname)
        const fileName = `${req.params.id}${extension}`
        const pathToFile = path.join(publicDirectory, fileName)
        fs.writeFileSync(pathToFile, buffer)
        const link = `http://localhost:3002/${fileName}`
        req.file = link
        next()
    } catch (error) {
        next(error)
    }
}