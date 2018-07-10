# only for development
FROM node:6.12.0

RUN npm install pm2 -g && yarn global add yarn

WORKDIR /usr/src/app

COPY ./ .
