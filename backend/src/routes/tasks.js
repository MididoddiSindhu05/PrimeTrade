const express = require('express');
const { body, param } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { getTasks, getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const validate = require('../middleware/validate');

const router = express.Router();
router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', [param('id').isInt().withMessage('Task ID must be numeric')], validate, getTask);
router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required')],
  validate,
  createTask
);
router.put(
  '/:id',
  [param('id').isInt().withMessage('Task ID must be numeric')],
  validate,
  updateTask
);
router.delete('/:id', [param('id').isInt().withMessage('Task ID must be numeric')], validate, deleteTask);

module.exports = router;
