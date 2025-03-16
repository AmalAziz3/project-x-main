FROM node:18-alpine

WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json ./
RUN npm ci

# Add bash for better debugging
RUN apk add --no-cache bash

# Set environment variables for better hot reloading
ENV CHOKIDAR_USEPOLLING=true
ENV WDS_SOCKET_PORT=0
ENV FAST_REFRESH=true
ENV WATCHPACK_POLLING=true

# Expose port 3000
EXPOSE 3000

# Start the React development server with polling
CMD ["npm", "start"] 