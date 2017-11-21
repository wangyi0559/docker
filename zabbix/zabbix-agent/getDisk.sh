#!/bin/bash
STATUS=$(cat /status)
if [ $STATUS == "0" ]; then
    sleep 11s
    exit 0
fi
if [ ! -f "/chain/CONTAINER_ID" ]; then
    sleep 11s  
　　exit 0  
fi
docker ps -f id=`cat /chain/CONTAINER_ID` -s | sed '1d' |  awk -F'  +' '{print $8}'