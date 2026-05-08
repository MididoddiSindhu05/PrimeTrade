const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { getAllUsers } = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/users', getAllUsers);

module.exports = router;
