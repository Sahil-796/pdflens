# Use Playwright's official base image with all dependencies
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all app files
COPY . .

# Build the project (for example, Next.js)
RUN npm run build

# Expose the port (Next.js default is 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
