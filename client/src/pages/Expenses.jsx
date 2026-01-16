import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2, Download, Plus } from 'lucide-react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Education', 'Shopping', 'Other'];

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const { data } = await api.get('/expense/all');
            setExpenses(data);
        } catch (err) {
            console.error("Error fetching expenses", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/expense/add', formData);
            setExpenses([data, ...expenses]);
            setFormData({
                title: '',
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0]
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding expense');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/expense/${id}`);
            setExpenses(expenses.filter(exp => exp._id !== id));
        } catch (err) {
            console.error("Error deleting expense", err);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/expense/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'expenses.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Error exporting data", err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Expense Management</h2>
                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    <Download size={18} />
                    <span>Export to Excel</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ADD FORM */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
                    <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
                    {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ex: Groceries"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="Ex: 150"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                        >
                            <Plus size={18} />
                            <span>Add Expense</span>
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Expense History</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : expenses.length === 0 ? (
                        <p className="text-gray-500">No expense records found.</p>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map((expense) => (
                                <div key={expense._id} className="group flex justify-between items-center p-3 border rounded hover:bg-gray-50 transition">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-12 bg-red-500 rounded-full"></div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{expense.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {expense.category} • {new Date(expense.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-red-600 font-bold text-lg">-${expense.amount}</span>
                                        <button
                                            onClick={() => handleDelete(expense._id)}
                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-50 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Expenses;
