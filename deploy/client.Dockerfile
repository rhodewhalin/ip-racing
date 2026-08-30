# IP RACING — Phaser/Three client, built with Vite and served by nginx.
#
# The build bakes in the subpath the hub reverse-proxies this game under via
# VITE_BASE_PATH -> vite `base` -> import.meta.env.BASE_URL, which net.ts uses to
# derive the same-origin Colyseus endpoint.
#
# Build context = repository root (client/ lives there):
#   docker build -f deploy/client.Dockerfile .

# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Subpath prefix, e.g. /games/ip-racing/ (trailing slash matters — it becomes
# import.meta.env.BASE_URL). Defaults to root for standalone builds.
ARG VITE_BASE_PATH=/games/ip-racing/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

# Optional explicit Colyseus URL. Leave unset for same-origin hub deployment —
# net.ts then builds wss://<host>${BASE_URL}. Set it only for cross-origin setups.
ARG VITE_SERVER_URL=""
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

# Manifest first for layer-cached install. No lockfile in the repo -> npm install.
COPY client/package.json client/package.json
RUN cd client && npm install --no-audit --no-fund

COPY client client
RUN cd client && npm run build

# ---------- runtime stage ----------
FROM nginx:1.29-alpine AS runtime

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
