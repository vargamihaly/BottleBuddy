const config = {
  development: {
    api: {
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3668',
      version: 'v1'
    }
  },
  production: {
    api: {
      // Use empty string for same-origin requests (Nginx reverse proxy)
      // This makes requests to /api/* which Nginx proxies to the backend
      baseUrl: import.meta.env.VITE_API_URL || '',
      version: 'v1'
    }
  }
};

export default config[import.meta.env.MODE === 'production' ? 'production' : 'development'];
