# Frontend Dockerfile - Multi-stage build for production

# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files from frontend folder
COPY frontend/package*.json ./
COPY frontend/bun.lockb* ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code from frontend folder
COPY frontend/ .

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration from docker folder
# Build context is now root (..), so docker/nginx.conf is correct
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
