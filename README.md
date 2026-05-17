# ✈️ Flight Route Optimizer

A full-stack aviation routing platform that finds the most optimal flight route between airports using advanced graph algorithms such as **Dijkstra, BFS, and DFS**.

The project combines:

* **DSA + Graph Theory**
* **Modern Full-Stack Development**
* **Authentication & Database Integration**
* **CI/CD Automation**
* **Docker + Kubernetes Deployment**
* **Jenkins-Based DevOps Workflow**

Built as a real-world learning project to understand how scalable route optimization systems and DevOps pipelines work together in production environments.

---

# 📌 Project Overview

Flight Route Optimizer allows users to:

* Search routes between airports
* Optimize by cost or distance
* Compare graph algorithms
* Benchmark algorithm performance
* Use dynamic + fallback airport datasets
* Authenticate users securely
* Deploy scalable containers using Kubernetes
* Automate deployments with Jenkins CI/CD

The application demonstrates practical implementation of:

* Graph Data Structures
* Shortest Path Algorithms
* REST API Architecture
* Authentication Systems
* Docker Containerization
* Kubernetes Orchestration
* Jenkins Automation
* Cloud Deployment Pipelines

---

# 🌟 Key Features

## ✈️ Flight Optimization

* 🔎 Dynamic airport search
* 🧮 Algorithm comparison (BFS, DFS, Dijkstra)
* 💰 Optimize by cost or distance
* 📊 Route benchmarking & graph visualization
* 🌍 Aviation API integration with fallback airport dataset

## 🔐 Authentication & Backend

* User Login & Registration
* JWT-based authentication
* MongoDB Atlas integration
* Secure API handling
* Environment variable configuration

## ⚙️ DevOps & Deployment

* Dockerized frontend & backend
* Jenkins CI/CD pipeline
* Kubernetes deployment automation
* Automated rollout restarts
* Health verification after deployments
* Parallelized builds for faster CI execution
* ngrok integration for webhook exposure during development
* Vercel deployment support
* Render deployment alternative

---

# 🧠 Algorithms Implemented

| Algorithm    | Purpose                           | Time Complexity  |
| ------------ | --------------------------------- | ---------------- |
| **Dijkstra** | Finds the shortest weighted route | O((V + E) log V) |
| **BFS**      | Finds minimum-hop route           | O(V + E)         |
| **DFS**      | Explores possible paths           | O(V + E)         |

---

# 🏗️ Tech Stack

## Frontend

* React
* Vite
* Axios
* Tailwind CSS
* Modern responsive UI

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* JWT Authentication
* AviationStack API

## DevOps & Cloud

* Docker
* Jenkins
* Kubernetes
* ngrok
* Vercel
* Render
* GitHub

---

# 📂 Project Structure

```bash
flight-optimizer/
│
├── client/
│   ├── api/
│   │   └── index.js           # Serverless backend API
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── controllers/
│   └── server.js
│
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── secrets.yaml
│
├── Jenkinsfile
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/hridayesh68/flight-optimizer.git
cd flight-optimizer
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
AVIATIONSTACK_API_KEY=your_api_key
```

---

## 4️⃣ Run Locally

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🐳 Docker Setup

## Build Docker Image

```bash
docker build -t flight-optimizer .
```

## Run Docker Container

```bash
docker run -d -p 3000:3000 flight-optimizer
```

### Explanation

| Command            | Meaning                                         |
| ------------------ | ----------------------------------------------- |
| `docker run`       | Starts a container                              |
| `-d`               | Runs container in detached mode                 |
| `-p 3000:3000`     | Maps localhost port 3000 to container port 3000 |
| `flight-optimizer` | Docker image name                               |

---

# ☸️ Kubernetes Deployment

The project supports Kubernetes-based deployments for scalable container orchestration.

## Kubernetes Features

* Automated deployments
* Replica management
* Service exposure
* Rolling updates
* Pod health checks
* Zero-downtime deployments

## Apply Kubernetes Configurations

```bash
kubectl apply -f kubernetes/
```

## Verify Pods

```bash
kubectl get pods
```

## Verify Services

```bash
kubectl get svc
```

## Restart Deployment

```bash
kubectl rollout restart deployment flight-optimizer
```

---

# 🚀 Jenkins CI/CD Pipeline

The project includes a complete Jenkins automation pipeline.

## CI/CD Workflow

```text
GitHub Push
     ↓
Jenkins Webhook Trigger
     ↓
Install Dependencies
     ↓
Run Tests
     ↓
Build Docker Images
     ↓
Push Images
     ↓
Deploy to Kubernetes
     ↓
Verify Deployment
```

---

## 🔥 Jenkins Features Implemented

### ✅ Parallelized Builds

Frontend and backend Docker images can be built in parallel to reduce deployment time.

### ✅ Automated Secret Injection

Environment variables are securely managed using Jenkins credentials and injected during build/deployment.

### ✅ Health Verification

Deployment verification stage checks:

* Pod availability
* Kubernetes service health
* Successful rollout

### ✅ Zero-Downtime Rollouts

Uses:

```bash
kubectl rollout restart deployment <deployment-name>
```

to ensure the newest containers are deployed safely.

### ✅ Automated GitHub Integration

GitHub webhooks automatically trigger Jenkins builds whenever new commits are pushed.

---

# 📄 Sample Jenkins Pipeline

```groovy
pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t flight-optimizer .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f kubernetes/'
            }
        }
    }
}
```

---

# 🌐 Deployment Architecture

```text
GitHub Repository
        ↓
     Jenkins
        ↓
 Docker Build & Push
        ↓
   Kubernetes Cluster
        ↓
Frontend + Backend Pods
        ↓
     User Access
```

---

# 🔐 Security Features

* JWT Authentication
* Protected API Routes
* Environment Variable Protection
* Secure MongoDB Atlas Connection
* Jenkins Secret Credential Injection
* Kubernetes Secret Support

---

# 📊 Benchmarking & Performance

The project benchmarks graph algorithms using generated route datasets.

Metrics include:

* Route calculation speed
* Memory usage
* Graph traversal performance
* Weighted vs unweighted path efficiency

---

# 🐞 Recent Improvements & Bug Fixes

## ✅ Fixed Double `/api/api` Routing Bug

Resolved incorrect API path concatenation that caused:

```text
404 Not Found
```

errors after hard refreshes.

### Solution

* Centralized Axios base URL handling
* Unified API route management
* Improved Vite proxy configuration

---

## ✅ Improved Jenkins Secret Handling

Migrated environment configuration handling to:

```groovy
writeFile
```

for safer and more reliable secret injection.

---

## ✅ Enhanced Deployment Observability

Added a dedicated:

```text
Verify Deployment
```

stage inside Jenkins pipeline to immediately confirm:

* Pods are running
* Services are accessible
* Rollouts completed successfully

---

## ✅ Optimized Build Process

* Added parallel build execution
* Improved Docker layer caching
* Explicit directory context handling
* Faster CI execution time

---

# 📌 Future Improvements

* Real-time flight tracking
* Redis caching
* Graph visualization dashboard
* Microservices architecture
* Helm charts for Kubernetes
* GitHub Actions integration
* AWS EKS deployment
* Prometheus & Grafana monitoring
* AI-based route prediction

---

# 🧪 Useful DevOps Commands

## Git Commands

```bash
git status
git add .
git commit -m "message"
git push origin main
```

---

## Docker Commands

```bash
docker build -t flight-optimizer .
docker images
docker ps
docker stop <container-id>
docker rm <container-id>
```

---

## Kubernetes Commands

```bash
kubectl get pods
kubectl get svc
kubectl apply -f deployment.yaml
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

---

## Jenkins Commands

```bash
systemctl status jenkins
systemctl restart jenkins
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed by **Hridayesh Debsarma**

Passionate about:

* Full-Stack Development
* DevOps
* Algorithms & DSA
* Cloud Computing
* System Design

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository
🍴 Fork the project
📢 Share with others

---
