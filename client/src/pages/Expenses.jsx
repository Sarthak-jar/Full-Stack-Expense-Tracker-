import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Trash2, Download, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const Expenses = () => {
    const {
        transactions, loading, addTransaction, deleteTransaction,
        exportData, params, setParams, totalPages
    } = useTransactions('expense');

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addTransaction(formData);
        if (success) {
            setFormData({
                title: '',
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            await deleteTransaction(id);
        }
    };

    // Filter Handlers
    const handleDateFilter = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const clearFilters = () => {
        setParams(prev => ({ ...prev, startDate: '', endDate: '', page: 1 }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Expense Management</h2>
                <button
                    onClick={exportData}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <Download size={18} />
                    <span>Export to Excel</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ADD FORM */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-1 h-fit transition-colors">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Add Expense</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:text-white"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Groceries"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:text-white"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="Ex: 150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:text-white"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:text-white"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2"
                        >
                            <Plus size={18} />
                            <span>Add Expense</span>
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2 flex flex-col min-h-[500px] transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Expense History</h3>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                type="date"
                                value={params.startDate}
                                onChange={(e) => handleDateFilter('startDate', e.target.value)}
                                className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm outline-none dark:bg-gray-900 dark:text-gray-300"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={params.endDate}
                                onChange={(e) => handleDateFilter('endDate', e.target.value)}
                                className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-sm outline-none dark:bg-gray-900 dark:text-gray-300"
                            />
                            {(params.startDate || params.endDate) && (
                                <button onClick={clearFilters} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex justify-center items-center">
                            <Spinner size={32} />
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center">
                            <EmptyState message="No expense records found." resetFilter={(params.startDate || params.endDate) ? clearFilters : null} />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 flex-1">
                                {transactions.map((expense) => (
                                    <div key={expense._id} className="group flex justify-between items-center p-3 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-2 h-12 bg-red-500 rounded-full"></div>
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{expense.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-red-600 dark:text-red-400 font-bold text-lg">-${expense.amount}</span>
                                            <button
                                                onClick={() => handleDelete(expense._id)}
                                                className="text-red-500 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-700">
                                    <button
                                        disabled={params.page <= 1}
                                        onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
                                        className="p-2 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Page {params.page} of {totalPages}</span>
                                    <button
                                        disabled={params.page >= totalPages}
                                        onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
                                        className="p-2 border dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-300"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
