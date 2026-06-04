FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared ./packages/shared
COPY client ./client
RUN npm install -w packages/shared -w client
RUN npm run build -w packages/shared
RUN npm run build -w client

FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
