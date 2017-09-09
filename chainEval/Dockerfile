FROM node:6.11.2
LABEL maintainer "wangyi"

EXPOSE 4000

RUN mkdir -p /home/Service

# Bundle app source
COPY test /home/Service

WORKDIR /home/Service/test
RUN npm install


RUN npm install
CMD ["node", "app"]