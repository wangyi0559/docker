FROM node:6.11.2
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

EXPOSE 8080

RUN mkdir -p /home/Service

WORKDIR /home/Service
COPY . /home/Service

WORKDIR /home/Service/test
RUN npm install


RUN npm install
CMD ["node", "/home/Service/test/app.js"]