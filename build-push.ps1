param(
    [string]$AppEnv = "production"
)

# Exit on error
$ErrorActionPreference = "Stop"

$ImageTag = "bielsolosos/noto-ui:latest"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Building Docker Image: $ImageTag" -ForegroundColor Cyan
Write-Host "Environment Profile: $AppEnv" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Run docker build with the environment profile as build argument
docker build --build-arg APP_ENV=$AppEnv -t $ImageTag .

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Build complete! Pushing image to registry..." -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

docker push $ImageTag

Write-Host "=============================================" -ForegroundColor Green
Write-Host "Successfully built and pushed $ImageTag!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
