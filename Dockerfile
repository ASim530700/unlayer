# Etapa de build do frontend
FROM node:18 AS build
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Etapa final com backend + frontend servidos por Express
FROM node:18
WORKDIR /app
COPY . .
COPY --from=build /app/frontend/build ./frontend/build
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
