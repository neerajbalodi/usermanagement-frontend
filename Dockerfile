# ---------------------------------------------------------------
# Frontend image (Day 4) - two stages:
#   1. "build": Node builds the Angular app into plain HTML/JS/CSS files
#   2. final  : nginx serves those files and forwards /api to the backend
# ---------------------------------------------------------------

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first: this layer is cached until package*.json changes
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npx ng build --configuration production

# ---- Stage 2: serve ----
FROM nginx:1.27-alpine

# Where /api requests go. Kubernetes: the "backend" Service in namespace user-management.
# docker-compose overrides it with http://backend:8080
ENV BACKEND_URL=http://backend.user-management.svc.cluster.local:8080
# Let nginx's start script find the container's DNS server for the template above
ENV NGINX_ENTRYPOINT_LOCAL_RESOLVERS=1

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/user-management/browser /usr/share/nginx/html

EXPOSE 80
