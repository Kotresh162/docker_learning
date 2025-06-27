# Use Node.js base image
FROM node:18

# Set environment variables
ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=ans123

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Expose the server port
EXPOSE 5050

# Start the server
CMD ["node", "server.js"]
