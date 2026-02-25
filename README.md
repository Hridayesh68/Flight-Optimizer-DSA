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
