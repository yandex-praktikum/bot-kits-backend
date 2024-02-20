FROM node:16-alpine
ENV NODE_ENV=production
RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-fund --no-audit
COPY . .
CMD ["npm", "start"]
