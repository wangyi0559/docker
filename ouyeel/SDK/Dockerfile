FROM node:6.11.2
LABEL maintainer "YI WANG <wangyi0559@gmail.com>"

EXPOSE 4000

RUN mkdir -p /home/Service

WORKDIR /home/Service
COPY . /home/Service

WORKDIR /home/Service/ouyeelSdk
RUN npm install

RUN echo '{ "request-timeout" : 45000,"crypto-hash-algo": "SHA2","crypto-keysize": 256,"crypto-hsm": false,"crypto-suite-software": {"EC": "fabric-client/lib/impl/CryptoSuite_ECDSA_AES.js"},"crypto-suite-hsm": {"EC": "fabric-client/lib/impl/bccsp_pkcs11.js"},"key-value-store": "fabric-client/lib/impl/FileKeyValueStore.js","nonce-size" : 24,"grpc-ssl-cipher-suites": "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES25"grpc-max-receive-message-length": 0,"grpc-max-send-message-length": 0}' > /home/Service/ouyeelSdk/node_modules/fabric-client/config/default.json

CMD ["node", "/home/Service/ouyeelSdk/app.js"]