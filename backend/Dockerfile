# Use Node.js LTS (Long Term Support) as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Set NODE_ENV
ENV NODE_ENV=production

# Make sure your server listens on 0.0.0.0
ENV HOST=0.0.0.0

EXPOSE $PORT

# Start the application
CMD ["npm", "start"]
