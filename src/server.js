import express from "express"

import listEndpoints from "express-list-endpoints"

import cors from "cors"

import postsRouter from "./posts/index.js"

import authorsRouter from "./authors/index.js"

import filesRouter from "./services/files/index.js"

import path, { dirname } from "path"

import { join } from "path"

import { fileURLToPath } from "url"

import { notFound, forbidden, catchAllErrorHandler } from "./posts/errorHandlers.js"


const _filename = fileURLToPath(import.meta.url)

const _dirname = dirname(_filename)

const server = express()

const port = process.env.PORT || 3002

console.log("ENV VAR -->", process.env.MONGO_CONNECTION)

// ***********************************CORS********************************

//CORS: CROSS-ORIGIN RESOURCE SHARING

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL] // we are allowing local FE and 
//the deployed FE to access to our API

const corsOpts = {
    origin: function (origin, next) {
        console.log("CURRENT ORIGIN: ", origin)
        if (!origin || whitelist.indexOf(origin) !== -1) {
            // if received origin is in the whitelist we are going to allow that request
            next(null, true)
        } else {
            // if it is not we are going to reject that request
            next(new Error(`Origin ${origin} not allowed`))
        }
    }
}



const publicFolderPath = join(process.cwd(), "public/img")

// *************GLOBAL MIDDLEWARES **************

server.use(cors(corsOpts))// it need to be added in order to be able to communicate our FE with BE 

server.use(express.json())//need to be specified before the routes,otherwise all the request bodies will be undefined



server.use(express.static(publicFolderPath))

server.use("/authors", authorsRouter)

server.use("/posts", postsRouter)

server.use("/files", filesRouter)

server.use(notFound)

server.use(forbidden)

server.use(catchAllErrorHandler)

console.log(listEndpoints(server))

server.listen(port, () => console.log("The server running on port :", port))

server.on("error", (error) =>
    console.log(`Server is not running due to: ${error}`)
)