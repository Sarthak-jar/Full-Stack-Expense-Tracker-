const express = require('express');
const router = express.Router();
const {
    addIncome,
    getIncomes,
    deleteIncome,
    exportIncomes
} = require('../controllers/incomeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/add', protect, addIncome);
router.get('/all', protect, getIncomes);
router.delete('/:id', protect, deleteIncome);
router.get('/export', protect, exportIncomes);

module.exports = router;
