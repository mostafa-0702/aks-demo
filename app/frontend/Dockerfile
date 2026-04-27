# Stage 1 — Build
FROM mcr.microsoft.com/mirror/docker/library/node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY public/ ./public/
COPY src/ ./src/

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2 — Serve
FROM mcr.microsoft.com/mirror/docker/library/nginx:1.25-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]