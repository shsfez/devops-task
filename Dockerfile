FROM node:12-alpine

WORKDIR /app

EXPOSE 3000

COPY ["package.json", "package-lock.json", "/app/"]

RUN npm install

COPY . /app/

CMD ["npm", "start"]
