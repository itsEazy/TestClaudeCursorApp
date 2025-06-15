#!/bin/bash

# Set variables
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_BACKEND="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/testclaudecursor-backend"
ECR_FRONTEND="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/testclaudecursor-frontend"

echo "Building and deploying containers..."

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push backend
echo "Building backend..."
cd backend
docker build -t $ECR_BACKEND:latest .
docker push $ECR_BACKEND:latest
cd ..

# Build and push frontend
echo "Building frontend..."
cd frontend/TestClaudeCursorApp
docker build -t $ECR_FRONTEND:latest .
docker push $ECR_FRONTEND:latest
cd ../..

# Update Kubernetes manifests with ECR URLs
sed -i "s|your-ecr-repo/backend:latest|$ECR_BACKEND:latest|g" k8s/backend-deployment.yaml
sed -i "s|your-ecr-repo/frontend:latest|$ECR_FRONTEND:latest|g" k8s/frontend-deployment.yaml

# Deploy to Kubernetes
echo "Deploying to Kubernetes..."
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

echo "Deployment complete!"
echo "Check status with: kubectl get pods"
echo "Get frontend URL with: kubectl get service frontend"