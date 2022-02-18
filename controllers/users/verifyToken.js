const CreateError = require("http-errors");

const { User } = require("../../models/users");

const verifyToken = async (req, res, next) => {
    try {
        const { verificationToken } = req.params
        const user = await User.findOne({verificationToken})
        if (!user) {
            throw new CreateError(404, {message: "User not found"})
        }
        await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })
        res.json( {message: 'Verification successful'})
    } catch (error) {
       next(error) 
    }
}

module.exports = verifyToken