FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-fund --no-audit
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
RUN npm install pm2 -g
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist/
EXPOSE 3000
CMD ["pm2-runtime", "dist/main.js"]
