# AWS Development Deployment

This folder contains Kubernetes manifests for deploying to AWS EKS.

## Prerequisites

1. **AWS CLI configured**
2. **kubectl configured for EKS cluster**
3. **Images pushed to ECR**

## Deploy to AWS EKS

1. **Switch to EKS context**:
   ```bash
   kubectl config use-context arn:aws:eks:us-east-1:010698976617:cluster/testclaudecursor-cluster
   ```

2. **Update secrets** (edit `secrets.yaml` with your actual Supabase credentials)

3. **Deploy**:
   ```bash
   kubectl apply -f k8s/dev/
   ```

4. **Check status**:
   ```bash
   kubectl get pods
   kubectl get services
   ```

5. **Access the application**:
   - Frontend: Use the LoadBalancer external IP
   - Backend: Internal service at backend:8080

## Images

The deployment uses these ECR images:
- Backend: `010698976617.dkr.ecr.us-east-1.amazonaws.com/testclaudecursor-backend:latest`
- Frontend: `010698976617.dkr.ecr.us-east-1.amazonaws.com/testclaudecursor-frontend:latest`

## Cleanup

```bash
kubectl delete -f k8s/dev/
```