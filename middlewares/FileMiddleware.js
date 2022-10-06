const multer = require("multer")
const { v1: uuidv1 } = require("uuid")
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "picturePath") {
      cb(null, "storage/store/")
    }
  },
  filename(req, file, cb) {
    const ext = file.originalname.split(".")
    if (!req.savedFiles) {
      req.savedFiles = {}
    }
    if (file.fieldname === "picturePath") {
      req.savedFiles[file.fieldname] = uuidv1() + "." + ext[ext.length - 1]
      cb(null, req.savedFiles[file.fieldname])
    }
  },
})

const types = ["image/jpeg", "image/png"]

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
