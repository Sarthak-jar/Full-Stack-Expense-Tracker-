const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get dashboard summary
// @route   GET /dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Base match stage for user and optional date range
    const matchStage = { user: userId };
    if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) matchStage.date.$gte = new Date(startDate);
        if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    // 1. Parallelize independent queries
    const [
        incomeResult,
        expenseResult,
        recentIncomes,
        recentExpenses,
        expensesLast30Days, // Or expenses in range
        incomeLast60Days    // Or income in range
    ] = await Promise.all([
        // Total Income in Range
        Income.aggregate([
            { $match: matchStage },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        // Total Expense in Range
        Expense.aggregate([
            { $match: matchStage },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        // Recent Incomes (Global - always show latest activity)
        Income.find({ user: userId }).sort({ date: -1 }).limit(5).lean(),
        // Recent Expenses (Global)
        Expense.find({ user: userId }).sort({ date: -1 }).limit(5).lean(),

        // Expenses Chart Data (Bar Chart) - Default 30 days or Match Range
        Expense.aggregate([
            {
                $match: startDate && endDate ? matchStage : {
                    user: userId,
                    date: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]),

        // Income Chart Data (Pie Chart Distribution) - Default 60 days or Match Range
        Income.aggregate([
            {
                $match: startDate && endDate ? matchStage : {
                    user: userId,
                    date: { $gte: new Date(new Date().setDate(new Date().getDate() - 60)) }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ])
    ]);

    const totalIncome = incomeResult[0]?.total || 0;
    const totalExpense = expenseResult[0]?.total || 0;
    const totalBalance = totalIncome - totalExpense;

    // Process Recent Transactions
    const recentTransactions = [
        ...recentIncomes.map(d => ({ ...d, type: 'income' })),
        ...recentExpenses.map(d => ({ ...d, type: 'expense' }))
    ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    // Expense Category Distribution (for Pie Chart if needed)
    // Adding this extra based on user request "Income vs Expense Pie chart" (totals used)
    // But maybe for detailed expense breakdown too.

    res.status(200).json({
        totalIncome,
        totalExpense,
        totalBalance,
        recentTransactions,
        last30DaysExpenses: expensesLast30Days,
        last60DaysIncome: incomeLast60Days,
        // Send extra meta if needed
    });
});

module.exports = { getDashboardSummary };
