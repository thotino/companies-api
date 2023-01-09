FROM node:14-buster-slim

RUN apt-get update && apt-get install -y curl

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY . /usr/app

RUN yarn install --production && yarn autoclean --init && yarn autoclean --force


RUN chmod +x docker-entrypoint.sh

ENTRYPOINT [ "./docker-entrypoint.sh" ]

EXPOSE 3000