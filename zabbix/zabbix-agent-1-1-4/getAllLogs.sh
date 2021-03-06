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
CONTAINER_ID=$(cat /chain/CONTAINER_ID)
sed -n '$=' /var/lib/docker/containers/$CONTAINER_ID/$CONTAINER_ID-json.log > /alllogsheight
function getLogs(){
    LOGSHEIGHT=$(cat /alllogsheight)
    LOGSNOW=$(cat /alllogsnow)

    if test $[LOGSNOW] -ge $[LOGSHEIGHT]
    then 
    sleep 10s
    exit 0
    fi
    LOGSTEMP=`expr $LOGSNOW + 5000`
    if test $[LOGSTEMP] -lt $[LOGSHEIGHT]
    then
    sed -n "$LOGSNOW,$LOGSTEMP p" /var/lib/docker/containers/$CONTAINER_ID/$CONTAINER_ID-json.log | sed -e 's/^{"log":"//' | sed 's/..$//' | sed -e 's/\\u001b\[[0-9]\{0,\}m//g' | sed -e 's/\\u003e/>/g' > /chain/alldockerlogs
    LOGSNOW=`expr $LOGSTEMP + 1`
    else
    sed -n "$LOGSNOW,$LOGSHEIGHT p" /var/lib/docker/containers/$CONTAINER_ID/$CONTAINER_ID-json.log | sed -e 's/^{"log":"//' | sed 's/..$//' | sed -e 's/\\u001b\[[0-9]\{0,\}m//g' | sed -e 's/\\u003e/>/g' > /chain/alldockerlogs
    LOGSNOW=`expr $LOGSHEIGHT + 1`
    fi
    echo $LOGSNOW > /alllogsnow
    cat /chain/alldockerlogs
}
getLogs