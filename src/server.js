import express from "express"

import listEndpoints from "express-list-endpoints"

import cors from "cors"

import postsRouter from "./posts/index.js"

const server = express()

const port = 3002

server.use(cors())

server.use(express.json())//need to be specified before the routes,otherwise all the request bodies will be undefined

server.use("/posts", postsRouter)

console.log(listEndpoints(server))

server.listen(port, () => console.log("The server running on port :", port))

server.on("error", (error) =>
    console.log(`Server is not running due to: ${error}`)
)