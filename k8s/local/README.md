# Local Kubernetes Deployment

This folder contains Kubernetes manifests for running the application locally on Docker Desktop.

## Prerequisites

1. **Enable Kubernetes in Docker Desktop**:
   - Open Docker Desktop
   - Go to Settings → Kubernetes
   - Check "Enable Kubernetes"
   - Click "Apply & Restart"

2. **Build local images**:
   ```bash
   # Build backend
   cd backend
   docker build -t testclaudecursor-backend:local .
   
   # Build frontend
   cd frontend/TestClaudeCursorApp
   docker build -t testclaudecursor-frontend:local .
   ```

## Deploy to local Kubernetes

1. **Switch to Docker Desktop context**:
   ```bash
   kubectl config use-context docker-desktop
   ```

2. **Update secrets** (edit `secrets.yaml` with your actual Supabase credentials)

3. **Deploy**:
   ```bash
   kubectl apply -f k8s/local/
   ```

4. **Check status**:
   ```bash
   kubectl get pods
   kubectl get services
   ```

5. **Access the application**:
   - Frontend: http://localhost (LoadBalancer on port 80)
   - Backend: `kubectl port-forward svc/backend 8080:8080` then http://localhost:8080

## Cleanup

```bash
kubectl delete -f k8s/local/
```