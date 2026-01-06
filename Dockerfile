# Use Node.js LTS
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache python3 py3-pip ffmpeg

# Install yt-dlp
RUN pip install yt-dlp

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose backend port
EXPOSE 4000

# Start the backend server
CMD ["node", "server.js"]
