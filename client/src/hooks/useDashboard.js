import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';
import toast from 'react-hot-toast';

export const useDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: '', // YYYY-MM
    });

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            let params = {};
            if (filters.month) {
                const [year, month] = filters.month.split('-');
                // Construct startDate and endDate for the month
                const startDate = new Date(year, month - 1, 1).toISOString();
                const endDate = new Date(year, month, 0).toISOString(); // Last day of month
                params = { startDate, endDate };
            }

            const result = await dashboardService.getSummary(params);
            setData(result);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return { data, loading, filters, setFilters, refresh: fetchDashboard };
};
