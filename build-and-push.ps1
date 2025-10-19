# Build and push Docker images to Docker Hub (PowerShell)
# Usage: .\build-and-push.ps1

# Check if DOCKER_USERNAME is set
if (-not $env:DOCKER_USERNAME) {
    Write-Host "Error: DOCKER_USERNAME not set" -ForegroundColor Red
    Write-Host "Run: `$env:DOCKER_USERNAME='your-dockerhub-username'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Building images..." -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
docker build -t "$env:DOCKER_USERNAME/firmable-client:latest" `
    --build-arg VITE_API_BASE_URL=/api `
    --platform linux/amd64 `
    ./client

# Build backend
Write-Host "Building backend..." -ForegroundColor Cyan
docker build -t "$env:DOCKER_USERNAME/firmable-server:latest" `
    --platform linux/amd64 `
    ./server

Write-Host "Logging in to Docker Hub..." -ForegroundColor Green
docker login

Write-Host "Pushing images..." -ForegroundColor Green
docker push "$env:DOCKER_USERNAME/firmable-client:latest"
docker push "$env:DOCKER_USERNAME/firmable-server:latest"

Write-Host "✅ Images pushed successfully!" -ForegroundColor Green
Write-Host "Frontend: $env:DOCKER_USERNAME/firmable-client:latest"
Write-Host "Backend: $env:DOCKER_USERNAME/firmable-server:latest"

