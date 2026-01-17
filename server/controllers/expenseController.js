const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const xlsx = require('xlsx');

// @desc    Add new expense
// @route   POST /expense/add
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
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
});

// @desc    Get all expenses with pagination and filtering
// @route   GET /expense/all
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query = { user: req.user.id };

    // Date Filtering
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    const count = await Expense.countDocuments(query);

    const expenses = await Expense.find(query)
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    res.status(200).json({
        expenses,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        totalExpenses: count
    });
});

// @desc    Delete expense
// @route   DELETE /expense/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
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
});

// @desc    Export expenses to Excel
// @route   GET /expense/export
// @access  Private
const exportExpenses = asyncHandler(async (req, res) => {
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
});

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    exportExpenses
};
