#!/bin/bash

# Set variables
CLUSTER_NAME="testclaudecursor-cluster"
REGION="us-east-1"
ECR_REPO_BACKEND="testclaudecursor-backend"
ECR_REPO_FRONTEND="testclaudecursor-frontend"

echo "Setting up AWS infrastructure..."

# Create ECR repositories
aws ecr create-repository --repository-name $ECR_REPO_BACKEND --region $REGION
aws ecr create-repository --repository-name $ECR_REPO_FRONTEND --region $REGION

# Create EKS cluster
eksctl create cluster \
  --name $CLUSTER_NAME \
  --region $REGION \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed

# Update kubeconfig
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

echo "EKS cluster created successfully!"
echo "ECR repositories created successfully!"
echo ""
echo "Next steps:"
echo "1. Build and push Docker images to ECR"
echo "2. Update k8s manifests with ECR image URLs"
echo "3. Deploy to Kubernetes"