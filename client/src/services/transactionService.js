import api from '../api/axios';

const transactionService = {
    // Income
    getIncomes: async (params) => {
        const response = await api.get('/income/all', { params });
        return response.data;
    },
    addIncome: async (data) => {
        const response = await api.post('/income/add', data);
        return response.data;
    },
    deleteIncome: async (id) => {
        const response = await api.delete(`/income/${id}`);
        return response.data;
    },
    exportIncomes: async () => {
        const response = await api.get('/income/export', { responseType: 'blob' });
        return response.data;
    },

    // Expense
    getExpenses: async (params) => {
        const response = await api.get('/expense/all', { params });
        return response.data;
    },
    addExpense: async (data) => {
        const response = await api.post('/expense/add', data);
        return response.data;
    },
    deleteExpense: async (id) => {
        const response = await api.delete(`/expense/${id}`);
        return response.data;
    },
    exportExpenses: async () => {
        const response = await api.get('/expense/export', { responseType: 'blob' });
        return response.data;
    }
};

export default transactionService;
