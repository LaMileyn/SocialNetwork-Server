const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet")
const morgan = require("morgan")
const multer = require("multer")
const cookieParser = require("cookie-parser")
const path = require("path")
const router = require("./routes/index")
const cors = require("cors")
const errorMiddleWare = require("./middlewares/error-middleware")
dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(helmet())
app.use(morgan("common"))
app.use('/api',router)
app.use(errorMiddleWare)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage});
app.post('/api/upload', upload.single('file'), (req, res,next) => {
    try {
        res.status(200).json(req.file.originalname)
    } catch (err) {
    }
})

// middlewares
const start = async () => {
    try {
        await mongoose.connect(process.env.DB_CONN, { useNewUrlParser : true, useUnifiedTopology : true}, () => {})
        app.listen(process.env.PORT || 5000, () => {})
    } catch (e) {
        console.log(e)
    }
}
start()