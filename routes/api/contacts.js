const express = require('express')
const router = express.Router()
const CreateError = require('http-errors')

const { Contact, contactsJoiSchema, favoriteJoiSchema } = require('../../models/contacts')
const {authenticate} = require('../../middlewares')


router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite = true } = req.query
    const skip = (page - 1) * limit
    const {_id} = req.user
    const result = await Contact.find({owner: _id, favorite},"-createdAt -updatedAt", {skip, limit: +limit}).populate('owner', 'email')
  res.json( result )
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const {id}=req.params
    const result = await Contact.findById(id)
    if (!result) {
      throw new CreateError(404, 'Not found')
    }
    res.json(result)
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 404
    }
    next(error)
  }
})

router.post('/', authenticate, async (req, res, next) => {
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
})

router.delete('/:id', async (req, res, next) => {
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
})

router.put('/:id', async (req, res, next) => {
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
})

router.patch('/:id/favorite', async (req, res, next) => {
  try {
    const {error} = favoriteJoiSchema.validate(req.body)
    if (error) {
      throw new CreateError(400, {message: "missing field favorite"})
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
})

module.exports = router
