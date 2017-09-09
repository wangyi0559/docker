FROM node:6.11.2
LABEL maintainer "wangyi"

EXPOSE 4000

RUN mkdir -p /home/Service

# Bundle app source
COPY chainEva /home/Service

WORKDIR /home/Service/chainEva
RUN npm install


RUN npm install
CMD ["node", "/home/Service/chainEva/app.js"]