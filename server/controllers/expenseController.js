const Expense = require('../models/Expense');
const xlsx = require('xlsx');

// @desc    Add new expense
// @route   POST /expense/add
// @access  Private
const addExpense = async (req, res) => {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const expense = await Expense.create({
        user: req.user.id,
        title,
        amount,
        category,
        date
    });

    res.status(201).json(expense);
};

// @desc    Get all expenses
// @route   GET /expense/all
// @access  Private
const getExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
};

// @desc    Delete expense
// @route   DELETE /expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(404);
        throw new Error('Expense not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id });
};

// @desc    Export expenses to Excel
// @route   GET /expense/export
// @access  Private
const exportExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    const data = expenses.map(expense => ({
        Title: expense.title,
        Amount: expense.amount,
        Category: expense.category,
        Date: new Date(expense.date).toLocaleDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Expenses');

    const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="expenses.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
};

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    exportExpenses
};
