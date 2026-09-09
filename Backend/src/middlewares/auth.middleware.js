const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")


// Middleware that authenticates requests using the JWT stored in the cookie.
async function authUser(req, res, next) {

    // Read the JWT from the authentication cookie.
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    // Check whether the token was explicitly revoked during logout.
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid"
        })
    }

    try {
        // Verify the token's signature and expiration using the server secret.
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Attach decoded JWT data to req so controllers can identify the user.
        req.user = decoded

        // Pass control to the next middleware/controller in the request chain.
        next()

    } catch (err) {

        // jwt.verify() throws an error if the token is invalid or expired.
        return res.status(401).json({
            message: "Invalid token."
        })
    }

}


module.exports = { authUser }