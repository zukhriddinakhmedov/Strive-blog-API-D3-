import express from "express"

import fs from "fs"

import uniqid from "uniqid"

import path, { dirname } from "path"

import { fileURLToPath } from "url"

const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const postsFilePath = path.join(_dirname, "posts.json")

const router = express.Router()

const aLoggerMiddleware = (req, res, next) => {
    console.log("This is  a middleware which we learnt today")
    next()// It is always needed to execute this function
    // to give the control to what is coming next (either another middleware or the request handler)
}

// GET /blogPosts => returns the list of blogposts
// GET /blogPosts /123 => returns a single blogpost
// POST /blogPosts => create a new blogpost
// PUT /blogPosts /123 => edit the blogpost with the given id
// DELETE /blogPosts /123 => delete the blogpost with the given id


//to get all the blogPosts
router.get("/", aLoggerMiddleware, (req, res, next) => {
    try {
        const postsBuffer = fs.readFileSync(postsFilePath)
        const postsAsString = postsBuffer.toString()
        const postsAsJson = JSON.parse(postsAsString)
        res.send(postsAsJson)
    } catch (error) {
        next(error)
    }
})

export default router