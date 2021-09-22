import express from "express"
import fs from "fs"
import uniqid from "uniqid"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const authorsFilePath = path.join(_dirname, "authors.json")

const router = express.Router()


//get authors
router.get("/", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(authorsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)
        res.send(fileAsJson)
    } catch (error) {
        res.send(500), send({ message: error.message })
    }
})

//to get an author
router.get("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(authorsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)
        const author = fileAsJson.find((author) => author.id === req.params.id)
        if (!author) {
            res.status(404).send({ message: `Author with ${req.params.id} is not found` })
        }
        res.send(author)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

//post an author
router.post("/", async (req, res, next) => {
    try {
        const { name, surname, email, dateOfBirth } = req.body

        const author = {
            id: uniqid(),
            name,
            surname,
            email,
            dateOfBirth,
            avatar: `https://ui-avatars.com/api/?name=${name}+${surname}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const fileAsBuffer = fs.readFileSync(authorsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)
        fileAsJson.push(author)

        fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJson))
        res.send(author)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }

})

//delete an author 
router.delete("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(authorsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)

        const author = fileAsJson.find(
            (author) => author.id === req.params.id
        )
        if (!author) {
            res.status(404).send({ message: `Author with ${req.params.id} is not found` })
        }
        fileAsJson = fileAsJson.filter((author) => author.id !== req.params.id)
        fs.writeFileSync(authorsFilePath, JOSN.stringify(fileAsJson))
        res.status(204).send()
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

//to update an author

router.put("/:id", async (req, res, next) => {
    try {
        const fileAsBuffer = fs.readFileSync(authorsFilePath)
        const fileAsString = fileAsBuffer.toString()
        const fileAsJson = JSON.parse(fileAsString)

        const authorIndex = fileAsJson.findIndex((author) => author.id === req.params.id)
        if (!authorIndex == -1) {
            res.status(404).send({ message: `Author with ${req.params.id} is not found` })
        }

        const previousAuthorData = fileAsJson[authorIndex]
        const changedAuthor = {
            ...previousAuthorData,
            ...req.body,
            updateAt: new Date(),
            id: req.params.id,
        }
        fileAsJson[authorIndex] = changedAuthor

        fs.writeFileSync(authorsFilePath, JSON.stringify(fileAsJson))
        res.send(changedAuthor)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})



export default router










