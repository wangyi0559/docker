#!/bin/bash
# author:wang yi
STATUS=$(cat /status)
if [ $STATUS == "0" ]; then
    sleep 11s
    exit 0
fi
if [ ! -f "/chain/CONTAINER_ID" ]; then
    sleep 11s  
　　exit 0  
fi
function getLogs(){
    docker logs --tail 8192 `cat /chain/CONTAINER_ID` > /chain/dockerlogs 2>&1
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