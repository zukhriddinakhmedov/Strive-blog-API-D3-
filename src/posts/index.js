import express from "express"

import fs from "fs"

import uniqid from "uniqid"

import path, { dirname } from "path"

import { fileURLToPath } from "url"

import createHttpError from "http-errors"

const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const postsFilePath = path.join(_dirname, "posts.json")

const getPosts = () => JSON.parse(fs.readFileSync(postsFilePath))
const writePosts = content => fs.writeFileSync(postsFilePath, JSON.stringify(content))

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
        const posts = getPosts()
        if (req.query && req.query.title) {
            const filteredPosts = posts.filter(post => post.title === req.query.title)
            res.send(filteredPosts)
        } else {
            res.send(posts)
        }
    } catch (error) {
        next(error)//if next will be used here we can send the error to the error handlers
    }
})

router.get("/:id", (req, res, next) => {
    try {
        const posts = getPosts()
        const post = posts.find(p => p.id === req.params.id)
        if (post) {
            res.send(post)
        } else {
            next(createHttpError(404, `Post with ID ${req.params.id} not found`)) //so 404 error handler will be triggered
        }
    } catch (error) {
        next(error)
    }
})

router.post("/", (req, res, next) => {
    try {
        const newPost = { ...req.body, id: uniqid(), createdAt: new Date() }
        const posts = getPosts()
        posts.push(newPost)
        writePosts(posts)

        res.status(201).send({ id: newPost.id })
    } catch (error) {
        next(error)
    }
})

router.put("/:id", (req, res, next) => {
    try {
        const posts = getPosts()
        const index = posts.findIndex(p => p.id === req.params.id)

        const postToModify = posts[index]
        const updatedField = req.body
        const udpatedPost = { ...postToModify, ...updatedField }
        posts[index] = udpatedPost

        writePosts(posts)

        res.send(udpatedPost)
    } catch (error) {
        next(error)
    }
})

router.delete("/:id", (req, res, next) => {
    try {
        const posts = getPosts()
        const filteredPosts = posts.filter(post => post.id !== req.params.id)
        writePosts(filteredPosts)

        res.status(204).send()
    } catch (error) {
        next(error)
    }
})
export default router