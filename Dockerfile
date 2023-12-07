# Use the official Node.js image
FROM node:16-alpine

RUN apk --no-cache add ffmpeg

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 9999

# Command to run your application
CMD ["node", "server.js"]
