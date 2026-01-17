import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';
import toast from 'react-hot-toast';

export const useTransactions = (type) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        startDate: '',
        endDate: ''
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (type === 'income') {
                response = await transactionService.getIncomes(params);
                setTransactions(response.incomes);
                setTotalPages(response.totalPages);
                setTotalTransactions(response.totalIncomes);
            } else {
                response = await transactionService.getExpenses(params);
                setTransactions(response.expenses);
                setTotalPages(response.totalPages);
                setTotalTransactions(response.totalExpenses);
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Failed to fetch transactions';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [type, params]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const addTransaction = async (data) => {
        try {
            if (type === 'income') {
                await transactionService.addIncome(data);
            } else {
                await transactionService.addExpense(data);
            }
            toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
            fetchTransactions();
            return true;
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add transaction';
            toast.error(msg);
            return false;
        }
    };

    const deleteTransaction = async (id) => {
        try {
            if (type === 'income') {
                await transactionService.deleteIncome(id);
            } else {
                await transactionService.deleteExpense(id);
            }
            toast.success('Deleted successfully');
            fetchTransactions(); // Refresh list
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete';
            toast.error(msg);
        }
    };

    const exportData = async () => {
        try {
            let blob;
            if (type === 'income') {
                blob = await transactionService.exportIncomes();
            } else {
                blob = await transactionService.exportExpenses();
            }

            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}s.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Export initiated');
        } catch (err) {
            toast.error('Failed to export');
        }
    };

    return {
        transactions,
        loading,
        error,
        params,
        setParams,
        totalPages,
        totalTransactions,
        addTransaction,
        deleteTransaction,
        exportData,
        refresh: fetchTransactions
    };
};
