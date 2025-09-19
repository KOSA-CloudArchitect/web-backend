# Use the official Node.js 18 image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
# First clean install, then verify mongodb is installed
RUN npm ci --silent && \
    npm list mongodb || npm install mongodb@^6.19.0 --save

# Bundle app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Verify critical dependencies are installed
RUN npm list mongodb mongoose || (echo "Installing missing dependencies..." && npm install mongodb@^6.19.0 mongoose@^8.18.0)

# Create logs directory with proper permissions
RUN mkdir -p /usr/src/app/logs && chmod 777 /usr/src/app/logs

# Create a non-root user

# Expose the port the app runs on
EXPOSE 8080

# Health check

# Start the application
CMD [ "node", "index.js" ]
