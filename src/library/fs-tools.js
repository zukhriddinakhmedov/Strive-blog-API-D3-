import { writeFile } from "fs"
import fs from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const publicFolderPath = join(process.cwd(), "./public/img")

export const savePictures = (avatar, contentAsBuffer) => writeFile(join(publicFolderPath, avatar), contentAsBuffer)