FROM node:16-alpine AS deps

WORKDIR /app

# Copy package files
COPY frontend/package.json ./

# Install dependencies
RUN npm install

# Development stage
FROM node:16-alpine AS development
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/package.json ./

# Copy source code
COPY frontend/ ./

# Start development server
EXPOSE 3000
CMD ["npm", "start"]

# Build stage (uncomment when needed for production)
# FROM development AS build
# RUN npm run build

# Production stage (uncomment when needed for production)
# FROM nginx:alpine AS production
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"] 