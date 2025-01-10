# Use the official Node.js LTS (Long Term Support) image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Install pnpm in the container
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml files to the container
COPY package.json pnpm-lock.yaml ./

# Install project dependencies using pnpm
RUN pnpm install

# Copy the entire project directory to the container
COPY . .

# Build the Application
RUN pnpm run build

# Set the command to start the application
CMD ["yarn", "backend"]