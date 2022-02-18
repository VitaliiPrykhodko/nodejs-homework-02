// const Joi = require('joi')
const CreateError = require("http-errors");

const { User, emailJoiSchema } = require("../../models/users");
const { sendMail } = require("../../helpers");

const verifyEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = emailJoiSchema.validate({email});
    if (error) {
      throw CreateError(400, "missing required field email");
    }
      const user = await User.findOne({ email });
      if (user.verify) {
          throw CreateError(400, {message: "Verification has already been passed"})
      }
    const mail = {
      to: email,
      subject: "Access email",
      html: `<a target="_blank" href='http://localhost:5000/api/users/verify/${user.verificationToken}'>Push</a>`
    };
     sendMail(mail);
      res.json({message: "Verification email sent"})
  } catch (error) {
    next(error);
  }
};

module.exports = verifyEmail;
