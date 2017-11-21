FROM node:6.11.2
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

EXPOSE 3389

RUN mkdir -p /home/Service

WORKDIR /home/Service
COPY . /home/Service

WORKDIR /home/Service/ouyeelProject
RUN npm install

CMD ["npm", "start"]