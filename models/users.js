const { Schema, model } = require('mongoose')
const Joi = require('joi')

const emailRegexp = /^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema({
 password: {
    type: String,
    minLength: 6,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: emailRegexp,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
    },
  token: {
    type: String,
    default: ""
  },
  avatarURL: {
    type: String
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  }
  },
    { versionKey: false, timestamps: true }
)

const User = model("user", userSchema)

const userJoiSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string(),
    token: Joi.string()
})

const subJoiSchema = Joi.object({
  subscription: Joi.string().allow("starter", "pro", "business").required()
})

const emailJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required()
})

module.exports = {
    User,
    userJoiSchema,
    subJoiSchema,
    emailJoiSchema
}