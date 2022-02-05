const express = require("express");
const router = express.Router();
const CreateError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env
const { User, userJoiSchema } = require("../../models/users");

router.post("/users/register", async (req, res, next) => {
  try {
    const { error } = userJoiSchema.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const { email, subscription, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new CreateError(409, "Email in use");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.create({
      email,
      password: hashPassword,
    });
    res.status(201).json({
      user: {
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/users/login", async (req, res, next) => {
  try {
    const { error } = userJoiSchema.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CreateError(401, "Email or password is wrong");
    }
      const comparePassword = await bcrypt.compare(password, user.password);
      console.log(comparePassword);
    if (!comparePassword) {
      throw new CreateError(401, "Email or password is wrong");
      }
      const payload = {
          id: user._id
      }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" })
    await User.findByIdAndUpdate(user._id, {token})
      res.json({
          token,
          user: {
        email,
        subscription
      },
      })
  } catch (error) {
    next(error);
  }
});

module.exports = router;
