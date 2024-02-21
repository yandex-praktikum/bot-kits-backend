FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --no-audit --no-fund --omit=dev && npm i --no-audit --no-fund -g pm2
ENTRYPOINT pm2-runtime start ecosystem.config.js
