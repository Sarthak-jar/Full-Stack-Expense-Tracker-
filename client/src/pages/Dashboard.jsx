import { useDashboard } from '../hooks/useDashboard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
    const { data, loading, filters, setFilters } = useDashboard();

    if (loading) return <div className="flex justify-center items-center h-full p-10"><Spinner size={40} /></div>;

    // Check if data is truly empty (fresh user) and no filters applied
    const isFreshUser = !data?.recentTransactions?.length && !filters.month && data?.totalIncome === 0;

    if (isFreshUser) return <EmptyState message="No transactions found. Add income or expenses to see your dashboard!" />;

    if (!data) return <div className="p-8 text-center text-red-500">Error loading data.</div>;

    const pieData = [
        { name: 'Income', value: data.totalIncome || 0 },
        { name: 'Expense', value: data.totalExpense || 0 }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Financial Overview</h2>

                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm transition-colors">
                    <Filter size={18} className="text-gray-500 dark:text-gray-400" />
                    <input
                        type="month"
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                        className="text-sm text-gray-700 dark:text-gray-300 outline-none bg-transparent"
                    />
                    {filters.month && (
                        <button
                            onClick={() => setFilters({ ...filters, month: '' })}
                            className="text-xs text-red-500 hover:text-red-700 ml-2"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition-colors">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                        <p className={`text-2xl font-bold ${data.totalBalance >= 0 ? 'text-gray-800 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}`}>
                            ${data.totalBalance.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition-colors">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">${data.totalIncome.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4 transition-colors">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">${data.totalExpense.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income vs Expense Pie */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Income vs Expense</h3>
                    <div className="h-64">
                        {data.totalIncome === 0 && data.totalExpense === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-400">No data for this period</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        <Cell key="cell-income" fill="#10B981" />
                                        <Cell key="cell-expense" fill="#EF4444" />
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `$${value}`}
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Expenses Trend Bar */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Expenses Trend</h3>
                    <div className="h-64">
                        {data.last30DaysExpenses?.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-400">No data for this period</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.last30DaysExpenses}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                                    <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                    <YAxis tick={{ fill: '#9CA3AF' }} />
                                    <Tooltip
                                        formatter={(value) => `$${value}`}
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    />
                                    <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income Category (Pie) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Income Distribution</h3>
                    <div className="h-64">
                        {data.last60DaysIncome?.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-gray-400">No data for this period</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.last60DaysIncome}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="total"
                                        nameKey="_id"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        stroke="none"
                                    >
                                        {data.last60DaysIncome.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `$${value}`}
                                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Transactions</h3>
                    <div className="space-y-4">
                        {data.recentTransactions?.length === 0 && <p className="text-gray-500 text-center py-8">No recent activity.</p>}
                        {data.recentTransactions?.map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                        {t.type === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">{t.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {t.type === 'income' ? '+' : '-'}${t.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
