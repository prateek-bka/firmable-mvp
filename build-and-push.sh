#!/bin/bash

# Build and push Docker images to Docker Hub
# Usage: ./build-and-push.sh

set -e

# Check if DOCKER_USERNAME is set
if [ -z "$DOCKER_USERNAME" ]; then
    echo "Error: DOCKER_USERNAME not set"
    echo "Run: export DOCKER_USERNAME=your-dockerhub-username"
    exit 1
fi

echo "Building images..."

# Build frontend
echo "Building frontend..."
docker build -t $DOCKER_USERNAME/firmable-client:latest \
    --build-arg VITE_API_BASE_URL=/api \
    --platform linux/amd64 \
    ./client

# Build backend
echo "Building backend..."
docker build -t $DOCKER_USERNAME/firmable-server:latest \
    --platform linux/amd64 \
    ./server

echo "Logging in to Docker Hub..."
docker login

echo "Pushing images..."
docker push $DOCKER_USERNAME/firmable-client:latest
docker push $DOCKER_USERNAME/firmable-server:latest

echo "✅ Images pushed successfully!"
echo "Frontend: $DOCKER_USERNAME/firmable-client:latest"
echo "Backend: $DOCKER_USERNAME/firmable-server:latest"

