const express = require('express')
const router = express.Router()
const CreateError = require('http-errors')
const Joi = require('joi')

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
  })

const updateFavorite = Joi.object({
  favorite:Joi.boolean().required()
})

const Contact = require('../../models/contacts')

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find({},"-createdAt -updatedAt")
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

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactsSchema.validate(req.body)
    if (error) {
      throw new CreateError(400, error.message)
    }
    // const  {name, email, phone} = req.body
    const result = await Contact.create(req.body)
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
    const {error} = contactsSchema.validate(req.body)
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
    const {error} = updateFavorite.validate(req.body)
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
