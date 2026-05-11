# Stage 1: Build dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

# Only copy necessary production files
# We install only production dependencies to keep the image small
COPY package*.json ./
RUN npm install --omit=dev

# Copy essential folders and files
COPY --from=builder /app/server.js ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/data ./data
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/models ./models
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/services ./services
COPY --from=builder /app/algorithms ./algorithms

EXPOSE 5000

# Use non-root user for security
USER node

CMD ["npm", "start"]