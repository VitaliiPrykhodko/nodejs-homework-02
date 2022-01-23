const express = require('express')
const router = express.Router()
const CreateError = require('http-errors')
const Joi = require('joi')

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
})

const contacts = require('../../models/contacts')

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts()
  res.json( result )
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const {id}=req.params
    const result = await contacts.getContactById(id)
    if (!result) {
      throw new CreateError(404, 'Not found')
    }
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const {error} = contactsSchema.validate(req.body)
    if (error) {
      throw new CreateError(400, error.message)
    }
    const  {name, email, phone} = req.body
    const result = await contacts.addContact(name, email, phone)
   res.status(201).json(result)
 } catch (error) {
   next(error)
 }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await contacts.removeContact(id)
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
    const { name, email, phone } = req.body
    const result = await contacts.updateContact(id, name, email, phone)
    if (!result) {
      throw new CreateError(404, 'Not found')
    }
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router
