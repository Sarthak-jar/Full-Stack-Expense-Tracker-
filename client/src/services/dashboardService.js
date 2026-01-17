import api from '../api/axios';

const dashboardService = {
    getSummary: async (params) => {
        const response = await api.get('/dashboard/summary', { params });
        return response.data;
    }
};

export default dashboardService;
