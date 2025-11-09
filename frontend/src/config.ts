const config = {
  development: {
    api: {
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3668',
      version: 'v1'
    }
  },
  production: {
    api: {
      // IMPORTANT: VITE_API_URL must be set during build for Azure deployment
      // Fallback is only for legacy Docker deployments with Nginx reverse proxy
      baseUrl: import.meta.env.VITE_API_URL || '',
      version: 'v1'
    }
  }
};

// Validate that API URL is set in production
if (import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL is not set! API calls will use relative URLs.');
}

export default config[import.meta.env.MODE === 'production' ? 'production' : 'development'];
