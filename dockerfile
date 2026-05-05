# Frontend Build
FROM node:20-alpine as frontend-builder

WORKDIR /app
COPY ./Frontend/package*.json ./
RUN npm install

COPY ./Frontend ./
RUN npm run build


# Backend Build
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies first
COPY ./Backend/package*.json ./
RUN npm install

# Copy backend source
COPY ./Backend ./

# Copy frontend build output
COPY --from=frontend-builder /app/dist /app/public

# Optional: only if you actually have a build step
# RUN npm run build

EXPOSE 3000

CMD ["node", "server.js"]