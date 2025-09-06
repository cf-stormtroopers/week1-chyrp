# syntax=docker/dockerfile:1

# ---- Base build stage ----
FROM node:20-slim AS build

WORKDIR /app

# Install deps separately for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Accept .env (for VITE_ variables)
# NOTE: Best practice is to provide this at runtime:

# Build the Vite app
RUN npm run build


# ---- Production stage ----
FROM nginx:alpine AS production

WORKDIR /usr/share/nginx/html

# Copy build artifacts
COPY --from=build /app/dist ./

# Copy custom nginx config (optional if you want SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
