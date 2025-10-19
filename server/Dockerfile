FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm ci --ignore-scripts --no-audit --no-fund

COPY . .

RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json package-lock.json ./

ENV NODE_ENV=production

RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

COPY --from=builder /app/dist ./dist
COPY ecosystem.config.cjs ./

RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install -g pm2

USER node

EXPOSE 5000

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]