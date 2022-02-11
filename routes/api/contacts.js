const express = require('express')
const router = express.Router()

const { authenticate } = require('../../middlewares')
const ctrl = require('../../controllers/contacts')

router.get('/', authenticate, ctrl.getAll)
router.get('/:id', ctrl.getById)
router.post('/', authenticate, ctrl.add)
router.delete('/:id', ctrl.remove)
router.put('/:id', ctrl.update)
router.patch('/:id/favorite', ctrl.updateByFavorite)

module.exports = router
