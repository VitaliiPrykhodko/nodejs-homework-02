const CreateError = require('http-errors')
const { Contact } = require('../../models/contacts')

const remove = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await Contact.findByIdAndRemove(id)
    if (!result) {
      throw new CreateError(404, 'Not found')
    }
    res.status(200).json({message: "contact deleted"})
  } catch (error) {
    next(error)
  }
}

module.exports = remove
