# ✈️ Flight Route Optimizer

A full-stack web application that finds the most optimal flight route between airports using graph algorithms like **Dijkstra, BFS, and DFS**.  
Built for learning and benchmarking Data Structures & Algorithms in a real-world aviation routing context.

---



## 📌 Project Overview

Flight Route Optimizer allows users to:

- Search routes between airports
- Optimize by cost or distance
- Compare different graph algorithms
- Benchmark algorithm performance
- Use dynamic + fallback airport datasets

The project demonstrates practical implementation of:

- Graph Data Structures
- Shortest Path Algorithms
- Backend API Architecture
- Serverless Deployment
- Real-world API integration

---

## 🧠 Algorithms Implemented

| Algorithm | Purpose | Complexity |
|------------|----------|------------|
| **Dijkstra** | Optimal shortest path | O((V + E) log V) |
| **BFS** | Minimum hops route | O(V + E) |
| **DFS** | Path exploration | O(V + E) |

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)
- Axios
- Modern UI Components

### Backend
- Node.js
- Express
- MongoDB (Atlas)
- AviationStack API (optional)


### Deployment
- Vercel (Frontend + Serverless)
- Render (Optional backend alternative)

---

## 📂 Project Structure
flight-optimizer/
│
├── client/ # Frontend (Vite)
│ ├── api/ # Serverless Express backend
│ │ └── index.js
│ ├── src/
│ ├── vite.config.js
│ └── package.json
│
└── README.md
---

## 🔍 Features

- 🔎 Dynamic airport search
- 🧮 Algorithm comparison (BFS, DFS, Dijkstra)
- 💰 Optimize by cost or distance
- 📊 Graph generation for benchmarking
- 🌍 Aviation API integration with fallback dataset
- 🔐 Authentication (Login / Register)
- 🗄 MongoDB storage

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hridayesh68/flight-optimizer.git
cd flight-optimizer/
```

---

## 🚀 CI/CD & Deployment

The project features a fully automated CI/CD pipeline built with **Jenkins** and **Kubernetes**.

### Automation Highlights:
- **Parallel Builds**: Optimized Docker builds for speed.
- **Automated Secret Management**: Secure injection of environment variables.
- **Zero-Downtime Rollouts**: Automated `rollout restart` to ensure the latest code is always live.
- **Health Verification**: Automated checks for pod and service availability.

For more details on the deployment architecture, see [CI_CD_DOCUMENTATION.md](./CI_CD_DOCUMENTATION.md).

---

## ✅ Recent Improvements & Bug Fixes

- **Fixed "Double /api" Bug**: Centralized API logic to prevent redundant path prefixes and resolve 404 errors.
- **Improved Secret Injection**: Transitioned to Jenkins `writeFile` for robust environment variable management.
- **Enhanced Observability**: Added a `Verify Deployment` stage to the pipeline for immediate feedback on deployment health.
- **Optimized Build Process**: Leveraged parallel processing and explicit directory contexts in Jenkins.
