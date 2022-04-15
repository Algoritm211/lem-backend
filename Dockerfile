FROM node:14

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY . /app/

EXPOSE 5000

CMD ["npm", "run", "dev"]
