const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

// Registers a new user after validating input and checking for duplicates.
async function registerUserController(req, res) {

    const { username, email, password } = req.body

    // Validate required registration fields on the backend.
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    // Check if either the username or email is already registered.
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    // Hash the password before storing it; 10 is the bcrypt salt-rounds cost.
    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    // Create a signed JWT containing the user's ID and username.
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    // Store the JWT in a cookie for authentication on future requests.
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


// Logs in a user by verifying their email and password.
async function loginUserController(req, res) {

    const { email, password } = req.body

    // Find the user using the email provided during login.
    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    // Compare the plain password with the bcrypt hash stored in MongoDB.
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    // Generate a new JWT after successful authentication.
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    // Store the JWT in a cookie so it is sent with future requests.
    res.cookie("token", token)

    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


// Logs out the user by blacklisting the current token and clearing the cookie.
async function logoutUserController(req, res) {

    const token = req.cookies.token

    // Blacklist the token so it cannot be reused before its natural expiry.
    if (token) {
        await tokenBlacklistModel.create({ token })
    }

    // Remove the authentication cookie from the browser.
    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}


// Returns the details of the currently authenticated user.
async function getMeController(req, res) {

    // req.user is populated by authentication middleware after JWT verification.
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


// Export controllers so they can be connected to routes.
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}