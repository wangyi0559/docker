FROM node:6.9.11
LABEL maintainer "wangyi"

EXPOSE 4000

ADD chainEva /app
WORKDIR /app

RUN npm install
CMD ["node", "/app/app.js"]
