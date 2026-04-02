const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

router.get('/', controller.getUsers);
router.post('/', controller.createUser);
router.get('/search', controller.searchUsers);

module.exports = router;
