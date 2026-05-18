FROM node:24-alpine AS builder

WORKDIR /app

ARG VITE_USERS_API_URL=/users-api
ARG VITE_TICKETS_API_URL=/tickets-api
ARG VITE_NOTIFICATIONS_API_URL=/notifications-api

ENV VITE_USERS_API_URL=$VITE_USERS_API_URL
ENV VITE_TICKETS_API_URL=$VITE_TICKETS_API_URL
ENV VITE_NOTIFICATIONS_API_URL=$VITE_NOTIFICATIONS_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
