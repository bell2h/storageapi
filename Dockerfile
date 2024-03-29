FROM node:6.2.2

RUN mkdir -p /app

WORKDIR /app

ADD . /app

RUN npm install

ENV NODE_ENV dev

EXPOSE 3000 80

CMD ["npm", "start"]
