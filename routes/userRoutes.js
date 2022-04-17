const express = require('express');
const { getAllUsers, getUsers, addUsers } = require('./../controllers/userController');
const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(addUsers);

router
    .route('/:id')
    .get(getUsers);

module.exports = router;