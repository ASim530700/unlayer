# Dockerfile

# Usa uma imagem base com Node
FROM node:18

ENV NODE_OPTIONS=--openssl-legacy-provider

# Cria diretório da app
WORKDIR /app

# Copia os ficheiros para a imagem
COPY . .

# Instala dependências do backend
RUN npm install --legacy-peer-deps

# Instala dependências e build do frontend
RUN cd frontend && npm install --legacy-peer-deps && npm run build

# Expõe a porta usada pela app
EXPOSE 8080

# Comando de arranque
CMD ["node", "server.js"]
