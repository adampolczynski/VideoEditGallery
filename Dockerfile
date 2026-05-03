FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies because the frontend build needs Vite.
RUN npm ci

# Copy application
COPY . .

# Build frontend
RUN npm run build

# Keep the runtime image lean after the build is complete.
RUN npm prune --omit=dev

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/settings', (r) => {if (r.statusCode !== 200) process.exit(1)}).on('error', () => process.exit(1))"

# Start application
CMD ["npm", "start"]
