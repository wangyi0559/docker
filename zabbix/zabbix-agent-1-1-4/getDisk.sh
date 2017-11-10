#!/bin/bash
STATUS=$(cat /status)
if [ $STATUS == "0" ]; then
    sleep 11s
    exit 0
fi
if [ ! -f "/chain/PEER_INDEX" ]; then
    sleep 11s  
　　exit 0  
fi
PEER_INDEX=$(cat /chain/PEER_INDEX)
case $PEER_INDEX in
        1)   CONTAINER_NAME="orderer.example.com" 
        ;;
        2)   CONTAINER_NAME="ca_peerOrg1" 
        ;;
        3)   CONTAINER_NAME="peer0.org1.example.com" 
        ;;
        4)   CONTAINER_NAME="peer1.org1.example.com" 
        ;;
        5)   CONTAINER_NAME="peer2.org1.example.com" 
        ;;
        6)   CONTAINER_NAME="peer3.org1.example.com" 
        ;;
        *)   echo 'error' >/dev/null 2>&1 
        ;;
    esac

docker system df -v | grep $CONTAINER_NAME | awk -F'  +' '{print $5}'
