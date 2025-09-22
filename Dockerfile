FROM oven/bun:latest AS builder

WORKDIR /app

COPY bun.lock package.json ./
RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
