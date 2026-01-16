const express = require('express');
const router = express.Router();
const {
    addExpense,
    getExpenses,
    deleteExpense,
    exportExpenses
} = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/add', protect, addExpense);
router.get('/all', protect, getExpenses);
router.delete('/:id', protect, deleteExpense);
router.get('/export', protect, exportExpenses);

module.exports = router;
