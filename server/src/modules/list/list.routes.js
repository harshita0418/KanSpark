const express = require('express');
const router = express.Router();
const { protect } = require('../auth/auth.middleware');
const {
  createList,
  getLists,
  updateList,
  deleteList,
  reorderLists,
} = require('./list.controller');

router.use(protect);

router.post('/', createList);
router.get('/', getLists);
router.patch('/:listId', updateList);
router.delete('/:listId', deleteList);
router.post('/reorder', reorderLists);

module.exports = router;