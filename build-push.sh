#!/bin/bash

# Exit on error
set -e

# Default to production profile if not specified
APP_ENV=${1:-production}
IMAGE_TAG="bielsolosos/noto-ui:latest"

echo "============================================="
echo "Building Docker Image: $IMAGE_TAG"
echo "Environment Profile: $APP_ENV"
echo "============================================="

# Run docker build with the environment profile as build argument
docker build --build-arg APP_ENV="$APP_ENV" -t "$IMAGE_TAG" .

echo "============================================="
echo "Build complete! Pushing image to registry..."
echo "============================================="

docker push "$IMAGE_TAG"

echo "============================================="
echo "Successfully built and pushed $IMAGE_TAG!"
echo "============================================="
