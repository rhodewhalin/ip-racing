# IP RACING — authoritative Colyseus 0.15 game server (WebSocket + HTTP matchmaking).
#
# Build context = ./server (see docker-compose.vm.yml). tsconfig: rootDir=src,
# outDir=dist  ->  src/index.ts compiles to dist/index.js.
#
#   docker build -f server/Dockerfile ./server

# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Manifest first for layer-cached install. No lockfile in the repo -> npm install.
COPY package.json ./
RUN npm install --no-audit --no-fund

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Drop devDependencies so the runtime node_modules is production-only.
RUN npm prune --omit=dev

# ---------- runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=2567

# Production deps (colyseus + @colyseus/schema + its nested deps) and compiled JS.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 2567
CMD ["node", "dist/index.js"]
