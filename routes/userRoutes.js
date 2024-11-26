const express = require('express');
const { signup,getUsers,updateUser,deleteUser,login } = require('../controllers/userController');

const router = express.Router();

router.post('/users', signup);           // ADD USER
router.get('/users', getUsers);          // GET USER

router.put('/users/:id', updateUser);    // UPDATE USER
router.delete('/users/:id', deleteUser); // DELETE USER

router.post('/login', login);   //LOGIN ADMIN

module.exports = router;