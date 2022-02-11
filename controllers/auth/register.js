const CreateError = require("http-errors");
const bcrypt = require("bcryptjs");
const gravatar = require('gravatar')

const { User, userJoiSchema } = require("../../models/users");

const register = async (req, res, next) => {
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
    const avatarURL = gravatar.url(email)
    await User.create({
      email,
      password: hashPassword,
      avatarURL
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
}

module.exports = register