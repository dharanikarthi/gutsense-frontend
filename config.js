// Configuration for GutSense Frontend
const CONFIG = {
    // OpenAI Configuration - Using Vercel serverless function for security
    OPENAI_API_ENDPOINT: '/api/analyze-food-openai',
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    
    // API Configuration (Legacy - keeping for other features)
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'  // Local development
        : 'https://gutsense-backend.vercel.app',  // Production - Deployed backend URL
    
    // API Endpoints
    ENDPOINTS: {
        AUTH: {
            SIGNUP: '/api/auth/signup',
            LOGIN: '/api/auth/login',
            LOGOUT: '/api/auth/logout',
            ME: '/api/auth/me',
            REFRESH: '/api/auth/refresh'
        },
        GUT_PROFILE: {
            CREATE: '/api/gut-profile/',
            GET: '/api/gut-profile/',
            UPDATE: '/api/gut-profile/',
            DELETE: '/api/gut-profile/',
            GUT_TYPES: '/api/gut-profile/gut-types',
            SENSITIVITIES: '/api/gut-profile/sensitivities'
        },
        FOOD: {
            ANALYZE: '/api/food/analyze',
            HISTORY: '/api/food/history',
            STATS: '/api/food/stats',
            SEARCH: '/api/food/search'
        }
    },
    
    // App Configuration
    APP_NAME: 'GutSense',
    VERSION: '1.0.0',
    
    // Local Storage Keys
    STORAGE_KEYS: {
        TOKEN: 'gutsense_token',
        USER: 'gutsense_user',
        GUT_PROFILE: 'gutsense_gut_profile',
        RECENT_SEARCHES: 'gutsense_recent_searches'
    }
};

// Utility function to get full API URL
function getApiUrl(endpoint) {
    return CONFIG.API_BASE_URL + endpoint;
}

// Utility function to make API calls
async function apiCall(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    const token = localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getApiUrl, apiCall };
}