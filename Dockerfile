FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-fund --no-audit
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund --omit=dev && npm i --no-audit --no-fund -g pm2
COPY --from=builder /app/dist ./dist/
COPY .env ./dist/
COPY ecosystem.config.js .
ENTRYPOINT pm2-runtime start ecosystem.config.js
