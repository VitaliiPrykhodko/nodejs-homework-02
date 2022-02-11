const { Contact} = require('../../models/contacts')

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20} = req.query
    const skip = (page - 1) * limit
    const {_id} = req.user
    const result = await Contact.find({owner: _id},"-createdAt -updatedAt", {skip, limit: +limit}).populate('owner', 'email')
  res.json( result )
  } catch (error) {
    next(error)
  }
}

module.exports = getAll