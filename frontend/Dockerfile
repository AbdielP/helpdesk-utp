FROM node:24-alpine AS builder

WORKDIR /app

ARG VITE_AUTH_API_URL=/auth-api
ARG VITE_USER_API_URL=/user-api
ARG VITE_SUPPORT_API_URL=/support-api
ARG VITE_ADMIN_API_URL=/admin-api

ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_USER_API_URL=$VITE_USER_API_URL
ENV VITE_SUPPORT_API_URL=$VITE_SUPPORT_API_URL
ENV VITE_ADMIN_API_URL=$VITE_ADMIN_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
