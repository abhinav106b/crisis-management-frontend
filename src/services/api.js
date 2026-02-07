import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },
    
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

// Crisis services
export const crisisService = {
    createCrisis: async (crisisData) => {
        const response = await api.post('/crisis', crisisData);
        return response.data;
    },
    
    getAllCrises: async (filters = {}) => {
        const response = await api.get('/crisis', { params: filters });
        return response.data;
    },
    
    getCrisisById: async (id) => {
        const response = await api.get(`/crisis/${id}`);
        return response.data;
    },
    
    updateCrisisStatus: async (id, status) => {
        const response = await api.put(`/crisis/${id}/status`, { status });
        return response.data;
    }
};

// NGO services
export const ngoService = {
    getAllNGOs: async (filters = {}) => {
        const response = await api.get('/ngos', { params: filters });
        return response.data;
    },
    
    getNGOById: async (id) => {
        const response = await api.get(`/ngos/${id}`);
        return response.data;
    }
};

// Resource services
export const resourceService = {
    getAllResources: async (filters = {}) => {
        const response = await api.get('/resources', { params: filters });
        return response.data;
    },
    
    getResourceById: async (id) => {
        const response = await api.get(`/resources/${id}`);
        return response.data;
    }
};

export default api;
