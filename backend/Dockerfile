FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --legacy-peer-deps --omit=dev

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy src directory for runtime configuration resolution
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/src/infrastructure ./src/infrastructure

EXPOSE 3000

CMD ["node", "dist/main"]
