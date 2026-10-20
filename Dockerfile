# --- Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines these at build time, so they must be available as build args.
ARG VITE_API_URL
ARG VITE_AUTH_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL

RUN npm run build

# --- Runtime stage ---
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
