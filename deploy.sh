#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ docker-compose is not installed. Please install it first."
    exit 1
fi

# Check for environment files
if [ ! -f "./web/.env" ]; then
    echo "⚠️  Warning: web/.env file not found"
    echo "Creating web/.env from example if it exists..."
    if [ -f "./web/.env.example" ]; then
        cp ./web/.env.example ./web/.env
    fi
fi

if [ ! -f "./server/.env" ]; then
    echo "⚠️  Warning: server/.env file not found"
    echo "Creating server/.env from example if it exists..."
    if [ -f "./server/.env.example" ]; then
        cp ./server/.env.example ./server/.env
    fi
fi

echo "📦 Pulling latest images..."
docker-compose pull

echo "🏗️  Building containers..."
docker-compose build --no-cache

echo "🧹 Cleaning up old containers..."
docker-compose down --remove-orphans

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "🔍 Checking service health..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🖥️  Backend: http://localhost:8000"
else
    echo "❌ Some services failed to start. Please check the logs:"
    docker-compose logs
    exit 1
fi

# Print the logs
echo "📝 Recent logs:"
docker-compose logs --tail=100

echo "✨ Deployment completed successfully!"
