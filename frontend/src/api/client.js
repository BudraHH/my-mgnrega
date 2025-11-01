import axios from 'axios';

// ✅ Create API instance with correct baseURL
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ✅ Add response interceptor for error handling
API.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// ✅ Get districts by state
export const getDistricts = (state) =>
    API.get('/mgnrega/districts', { params: { state } });

// ✅ FIXED: Use API instance (not axios) + add fin_year parameter
export const getDistrictData = (state, district, financialYear) => {
    return API.get('/mgnrega/district', {
        params: {
            state,
            district,
            fin_year: financialYear  // ✅ ADDED: financialYear parameter
        }
    });
};

// ✅ FIXED: Add fin_year parameter + correct endpoint
export const getStateAverage = (state, financialYear) =>
    API.get('/mgnrega/state-average', {  // ✅ Changed: /state-avg → /state-average
        params: {
            state,
            fin_year: financialYear  // ✅ ADDED: financialYear parameter
        }
    });

// ✅ ADDED: Get district rankings
export const getDistrictRankings = (state, financialYear) =>
    API.get('/mgnrega/district-rankings', {
        params: {
            state,
            fin_year: financialYear
        }
    });

export default API;
