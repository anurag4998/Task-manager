const jwt = require("jsonwebtoken");
const User = require("../models/user")

const auth = async (req, resp, next) => {

    try {

        const token = req.header("Authorization").split(" ")
        const decoded = jwt.verify(token[1], process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })
        if (!user)
            throw new Error()
        req.token = token[1]
        req.user = user
        next()
    }
    catch (e) {
        resp.status(401).send({ error: "please authenticate" })
    }
}

module.exports = auth