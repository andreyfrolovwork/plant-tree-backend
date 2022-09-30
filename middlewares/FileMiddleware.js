const multer = require("multer")
const { v1: uuidv1 } = require("uuid")
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "treePicture") {
      cb(null, "storage/store/")
    }
  },
  filename(req, file, cb) {
    if (!req.savedFiles) {
      req.savedFiles = {}
    }
    if (file.fieldname === "treePicture") {
      req.savedFiles[file.fieldname] = uuidv1() + ".jpg"
      cb(null, req.savedFiles[file.fieldname])
    }
  },
})

const types = ["image/jpeg"]

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const fileMiddleware = multer({
  storage,
  fileFilter,
})

module.exports = fileMiddleware
