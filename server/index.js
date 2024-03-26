const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const {connect} = require("./CONFIG/databse")
const {cloudinaryConnect} = require('./CONFIG/cloudinary')
const authRoutes = require("./ROUTES/AuthRoutes")
const userRoutes = require("./ROUTES/UserRoutes")
const categoryRoutes = require('./ROUTES/CategoryRoutes')
const courseRoutes = require('./ROUTES/CourseRoutes')

// loading environemnt variables 
dotenv.config()

// setting up port number
const PORT = process.env.PORT || 4000

// Connect to DataBase
connect()
// connect to cloudinary
cloudinaryConnect()
// creating express instance
const app = express()

// setting up  middleware for data parsing
app.use(express.json({
	limit:'150mb'
}))
app.use(bodyParser.json({
	limit:'150mb'
}))
app.use(cors({
    origin: "*",
    method: ['GET','POST'],
	limit:'150mb'
}))
app.use(cookieParser())

// setting up router
app.use('/api/v1',authRoutes)
app.use('/api/v1',userRoutes)
app.use("/api/v1",categoryRoutes)
app.use('/api/v1',courseRoutes)

app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
