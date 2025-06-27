
FROM node:18


ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=ans123


WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .


EXPOSE 5050


CMD ["node", "server.js"]
