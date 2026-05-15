# CI/CD & Deployment Documentation

This document outlines the architecture of the Flight Route Optimizer's automated deployment pipeline and the solutions implemented to resolve common CI/CD bottlenecks.

## 🚀 CI/CD Pipeline Architecture

The project uses **Jenkins** for continuous integration and **Kubernetes (K3s)** for container orchestration.

### Pipeline Stages:
1. **Checkout**: Pulls the latest code from the `main` branch.
2. **Build Images**: Builds Docker images for both `client` (Frontend) and `server` (Backend) in parallel.
3. **Push to Docker Hub**: Pushes the tagged `:latest` images to Docker Hub.
4. **Create Kubernetes Secret**: Dynamically generates a Kubernetes secret from Jenkins credentials to inject environment variables into the backend.
5. **Deploy to Kubernetes**: Applies the K8s manifests and triggers a rollout restart.
6. **Verify Deployment**: Monitors the rollout status and verifies pod/service health.

---

## 🛠️ Issues Encountered & Solutions

### 1. Permission & Injection Issues (.env)
- **Problem**: Using shell commands like `cp` to inject secrets into the frontend during build often failed due to file permission issues on the Jenkins agent.
- **Solution**: Implemented the Jenkins `writeFile` DSL. This provides a cleaner, safer, and platform-independent way to write environment files directly into the build context.

### 2. Context Path Errors
- **Problem**: Running build commands from the root often led to directory nesting errors (e.g., looking for `client/client`).
- **Solution**: Used Jenkins `dir()` blocks to explicitly set the working directory for each component's build process.

### 3. The "Double /api" Prefix (404 Errors)
- **Problem**: The frontend was making requests to `/api/api/route` because the `VITE_API_URL` variable and the service code both contained the `/api` prefix.
- **Solution**: 
    - Created a centralized `api.js` service using an Axios instance.
    - Set the `baseURL` to `/api`.
    - Removed all hardcoded `/api` prefixes from the service layer and components.
    - Result: Clean, consistent routing to `/api/route`.

### 4. Pipeline Performance
- **Problem**: Sequential builds were slow.
- **Solution**: Implemented `parallel` blocks in the Jenkinsfile to build and push images concurrently, cutting deployment time by ~50%.

### 5. Stale Kubernetes Deployments
- **Problem**: Kubernetes does not automatically restart pods when an image tagged `:latest` is updated in the registry.
- **Solution**: Added `kubectl rollout restart` to the deployment stage to force Kubernetes to pull the fresh images immediately after the push.

---

## 📈 Verification Checklist
- [x] Jenkins build status: **Success**
- [x] Frontend requests: **Correctly routed to `/api/...`**
- [x] Kubernetes Pods: **Running with latest image**
- [x] Ingress/Service: **Healthy and accessible**
