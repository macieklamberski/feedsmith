FROM oven/bun:alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY docs ./docs
RUN bun run docs:build

FROM nginx:alpine
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
RUN echo 'server { \
  gzip on; \
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
  \
  listen 80; \
  server_name _; \
  index index.html; \
  \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri $uri.html $uri/ =404; \
    error_page 404 /404.html; \
    error_page 403 /404.html; \
    \
    location ~* ^/assets/ { \
      expires 1y; \
      add_header Cache-Control "public, immutable"; \
    } \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
