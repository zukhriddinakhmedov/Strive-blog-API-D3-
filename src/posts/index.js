import express from "express"

import fs from "fs"

import uniqid from "uniqid"

import path, { dirname } from "path"

import { fileURLToPath } from "url"

import createHttpError from "http-errors"

import { checkPostSchema, checkSearchSchema, checkValidationResult } from "./validation.js"

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

//search get
router.get("/search", checkSearchSchema, checkValidationResult, async (req, res, next) => {
    try {
        const { title } = req.query
        const fileAsBuffer = getPosts()
        const fileAsString = fileAsBuffer.toString()
        const postsArray = JSON.parse(fileAsString)
        const filteredPosts = postsArray.filter((post) =>
            post.title.toLowerCase().includes(title.toLowerCase())
        )
        res.send(filteredPosts)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

//to get all the blogPosts
router.get("/", aLoggerMiddleware, async (req, res, next) => {
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
//for single get 
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
//comments get
router.get("/:id/comments", async (req, res, next) => {
    try {
        const posts = getPosts()
        const post = posts.find((post) => post.id === req.params.id)
        if (!post) {
            res.status(404).send({ mesage: `post with ${req.params.id} is not found` })
        }
        post.comments = blog.comments || []
        res.send(blog.comments)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

router.post(
    "/", checkPostSchema, checkValidationResult, async (req, res, next) => {
        try {
            const post = {
                id: uniqid(),
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            const posts = getPosts()
            posts.push(post)
            writePosts(posts)

            res.status(201).send(post)
        } catch (error) {
            next(error)
        }
    })

//to update the post
router.put("/:id", async (req, res, next) => {
    try {
        const posts = getPosts()
        const postIndex = posts.findIndex(p => p.id === req.params.id)
        if (!postIndex == -1) {
            res
                .status(404)
                .send({ message: `psot with ${req.params.id} is not found` })
        }
        const previousPostData = posts[postIndex]
        const updatedField = {
            ...previousPostData,
            ...req.body,
            updatedAt: new Date(),
            id: req.params.id,
        }

        posts[postIndex] = updatedField
        writePosts(posts)
        res.send(updatedField)
    } catch (error) {
        res.send(500).send({ message: error.message })
    }
})

//to update the comment
router.put("/:id/comment", async (req, res, next) => {
    try {
        const { text, userName } = req.body
        const comment = { id: uniqid(), text, userName, createdAt: new Date() }
        const posts = getPosts()
        const postIndex = posts.findIndex((post) => post.id === req.params.id)
        if (!postIndex == -1) {
            res
                .status(404)
                .send({ message: `psot with ${req.params.id} is not found` })
        }
        const previousPostData = posts[postIndex]
        previousPostData.comments = previousPostData.comments || []
        const updatedField = {
            ...previousPostData,
            ...req.body,
            comments: [...previousPostData.comments, comment],
            updatedAt: new Date(),
            id: req.params.id,
        }

        posts[postIndex] = updatedField
        writePosts(posts)
        res.send(updatedField)
    } catch (error) {
        console.log(error)
        res.send(500).send({ message: error.message })
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