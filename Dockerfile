# Multi-stage build for Vanish AI

# Stage 1: Backend
FROM python:3.11-slim as backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Expose backend port
EXPOSE 8000

# Stage 2: Frontend
FROM node:18-alpine as frontend

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend code
COPY frontend/ .

# Build frontend
RUN npm run build

# Stage 3: Production
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from backend stage
COPY --from=backend /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend /usr/local/bin /usr/local/bin

# Copy backend code
COPY backend/ .

# Copy built frontend from frontend stage
COPY --from=frontend /app/dist /usr/share/nginx/html

# Configure nginx
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://localhost:8000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/sites-available/default

# Create startup script
RUN echo '#!/bin/bash\n\
nginx &\n\
cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 &\n\
wait' > /start.sh && chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]

