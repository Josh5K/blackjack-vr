FROM node:14.16.0-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

ADD . /usr/src/app

RUN npm run tsc

CMD [ "npm", "start" ]
