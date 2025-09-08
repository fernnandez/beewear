FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

# Configurar timezone no container
RUN apk add --no-cache tzdata
ENV TZ=${TZ:-UTC}

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

CMD ["node", "dist/src/main.js"]
