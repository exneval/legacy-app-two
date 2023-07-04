# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm i

# Copy the rest of the project files
COPY . .

# Build the React app
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4173

# Expose the port
EXPOSE 4173

# Start the server
CMD ["npm", "run", "serve"]
