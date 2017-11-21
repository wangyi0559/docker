#!/bin/bash
# author:wang yi
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
function getLogs(){
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
    docker logs --tail 8192 $CONTAINER_NAME > /chain/dockerlogs 2>&1
    cat /chain/dockerlogs | grep -E '(Starting new Broadcast handler|Closing Broadcast stream)' > /chain/BroadcastTime
    cat /chain/dockerlogs | grep -E '(Adding payload locally,|\[chaincode\] Execute -> .* Exit)' | grep -A 1 'Adding payload locally,' > /chain/TransactionTime
    A=$(cat /chain/BroadcastTime)
    B=$(cat /chain/TransactionTime)
    if [ -z "$A" -o "$A" = " " ] && [ -z "$B" -o "$B" = " " ]; then
        sleep 10s
    else
        cat /chain/BroadcastTime
        cat /chain/TransactionTime
    fi
}
getLogs