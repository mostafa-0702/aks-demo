FROM mcr.microsoft.com/mirror/docker/library/node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/server-fixed.js"]