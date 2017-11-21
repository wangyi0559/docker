FROM node:6.11.2
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

EXPOSE 4000

RUN mkdir -p /home/Service

WORKDIR /home/Service
COPY . /home/Service

WORKDIR /home/Service/ouyeelSdk
RUN npm install

CMD ["node", "/home/Service/ouyeelSdk/app.js"]