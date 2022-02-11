const CreateError = require('http-errors')
const { Contact, contactsJoiSchema } = require('../../models/contacts')

const update = async (req, res, next) => {
  try {
    const {error} = contactsJoiSchema.validate(req.body)
    if (error) {
      throw new CreateError(400, error.message)
    }
    const { id } = req.params
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
    if (!result) {
      throw new CreateError(404, 'Not found')
    }
    res.status(200).json(result)
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404
    }
    next(error)
  }
}

module.exports = update