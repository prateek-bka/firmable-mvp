FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json package-lock.json ./

RUN npm ci --ignore-scripts --no-audit --no-fund

COPY . .

# Build argument for API URL (default for production)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Serve with Caddy

FROM caddy:2-alpine

COPY --from=builder /app/dist /usr/share/caddy

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]