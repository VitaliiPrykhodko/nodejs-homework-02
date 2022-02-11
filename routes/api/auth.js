const express = require("express");
const router = express.Router();

const ctrl = require('../../controllers/auth')

router.post("/users/register", ctrl.register)
router.post("/users/login", ctrl.login)

module.exports = router;
