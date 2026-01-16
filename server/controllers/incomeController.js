const Income = require('../models/Income');
const xlsx = require('xlsx');

// @desc    Add new income
// @route   POST /income/add
// @access  Private
const addIncome = async (req, res) => {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const income = await Income.create({
        user: req.user.id,
        title,
        amount,
        category,
        date
    });

    res.status(201).json(income);
};

// @desc    Get all incomes
// @route   GET /income/all
// @access  Private
const getIncomes = async (req, res) => {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(incomes);
};

// @desc    Delete income
// @route   DELETE /income/:id
// @access  Private
const deleteIncome = async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        res.status(404);
        throw new Error('Income not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the income user
    if (income.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await income.deleteOne();

    res.status(200).json({ id: req.params.id });
};

// @desc    Export incomes to Excel
// @route   GET /income/export
// @access  Private
const exportIncomes = async (req, res) => {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });

    const data = incomes.map(income => ({
        Title: income.title,
        Amount: income.amount,
        Category: income.category,
        Date: new Date(income.date).toLocaleDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Incomes');

    const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="incomes.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
};

module.exports = {
    addIncome,
    getIncomes,
    deleteIncome,
    exportIncomes
};
