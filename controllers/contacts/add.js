const CreateError = require('http-errors')
const { Contact, contactsJoiSchema} = require('../../models/contacts')

const add = async (req, res, next) => {
  try {
    const {error} = contactsJoiSchema.validate(req.body)
    if (error) {
      throw new CreateError(400, error.message)
    }
    const data = {...req.body, owner: req.user._id}
    const result = await Contact.create(data)
   res.status(201).json(result)
 } catch (error) {
   next(error)
 }
}

module.exports = add