const Income = require('../models/Income');
const Expense = require('../models/Expense');

// @desc    Get dashboard summary
// @route   GET /dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Income & Expenses
        const incomeResult = await Income.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const expenseResult = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalIncome = incomeResult[0]?.total || 0;
        const totalExpense = expenseResult[0]?.total || 0;
        const totalBalance = totalIncome - totalExpense;

        // 2. Recent Transactions (Last 5 combined sort by date)
        const recentIncomes = await Income.find({ user: userId })
            .sort({ date: -1 })
            .limit(5)
            .lean()
            .then(docs => docs.map(d => ({ ...d, type: 'income' })));

        const recentExpenses = await Expense.find({ user: userId })
            .sort({ date: -1 })
            .limit(5)
            .lean()
            .then(docs => docs.map(d => ({ ...d, type: 'expense' })));

        const recentTransactions = [...recentIncomes, ...recentExpenses]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        // 3. Analytics for Charts

        // Last 30 days expenses (Bar chart)
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const expensesLast30Days = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: last30Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Income vs Expense (Pie chart) - using totals already calculated

        // Last 60 days income (Pie chart by category could be nice, or just trend)
        // User asked for "Last 60 days income (Pie chart)" -> Likely meaning Category breakdown for last 60 days
        const last60Days = new Date();
        last60Days.setDate(last60Days.getDate() - 60);

        const incomeLast60Days = await Income.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: last60Days }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const expenseWrapped = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: { $gte: last30Days }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ]);


        res.status(200).json({
            totalIncome,
            totalExpense,
            totalBalance,
            recentTransactions,
            last30DaysExpenses: expensesLast30Days,
            last60DaysIncome: incomeLast60Days,
            last30DaysExpenseCategory: expenseWrapped
        });

    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

module.exports = { getDashboardSummary };
