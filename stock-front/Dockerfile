# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve com Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
