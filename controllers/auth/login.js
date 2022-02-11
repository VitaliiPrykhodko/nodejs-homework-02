const CreateError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const { SECRET_KEY } = process.env
const { User, userJoiSchema } = require("../../models/users");

const login = async (req, res, next) => {
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
}

module.exports = login