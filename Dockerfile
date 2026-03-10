FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm install vite @vitejs/plugin-vue vue vue-router

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Remove dev dependencies after build
RUN rm -rf node_modules && npm install --omit=dev

# Expose port
EXPOSE 3001

# Data volume for SQLite persistence
VOLUME /app/server/data

ENV NODE_ENV=production
CMD ["node", "server/index.js"]
