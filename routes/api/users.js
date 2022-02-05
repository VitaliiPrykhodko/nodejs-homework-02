const express = require("express");
const router = express.Router();
const CreateError = require("http-errors");

const { authenticate } = require('../../middlewares')
const { User } = require("../../models/users");
const {subJoiSchema} = require("../../models/users")


router.get("/current", authenticate, async (req, res, next) => {
    res.json({
        email: req.user.email,
        subscription: req.user.subscription
    })
})

router.get("/logout", authenticate, async (req, res, next) => {
    const { _id } = req.user
    await User.findByIdAndUpdate(_id, { token: "" })
    res.status(204).send()
})

router.patch('/:id/subscription', async (req, res, next) => {
  try {
    const {error} = subJoiSchema.validate(req.body)
    if (error) {
      throw new CreateError(400, {message: "missing field subscription"})
    }
      const { id } = req.params
      console.log(req.params);
    const result = await User.findByIdAndUpdate(id,  req.body, {new: true, runValidators: true})
    if (!result) {
      throw new CreateError((401, 'Not authorized'))
    }
    res.status(200).json(result)
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404
    }
    next(error)
  }
})

module.exports = router