const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {connect} = require("./CONFIG/databse")
const authRoutes = require("./ROUTES/AuthRoutes")

// setting up port number
const PORT = process.env.PORT || 4000

// loading environemnt variables 
dotenv.config()

// Connect to DataBase
connect()

// creating express instance
const app = express()

// setting up  middleware for data parsing
app.use(express.json())
app.use(cors({
    origin: "*",
    method: ['GET','POST']
}))
app.use(cookieParser())

// setting up router
app.use('/api/v1',authRoutes)
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
