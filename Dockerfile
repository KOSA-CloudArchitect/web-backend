# Use the official Node.js 18 image
FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Create a non-root user

# Expose the port the app runs on
EXPOSE 8080

# Health check

# Start the application
CMD [ "node", "index.js" ]
