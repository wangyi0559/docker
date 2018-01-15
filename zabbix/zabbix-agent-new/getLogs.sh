#!/bin/bash
# author:wang yi

if [ ! -f "/chain/scripts/getLogs.sh" ]; then
sleep 10s
exit 0
fi

INIT=$(/getlogsinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getLogs.sh > /dev/null 2>&1 &
    echo 1 > /getlogsinit
    sleep 10s
    exit 0
fi

A=$(cat /chain/finallogs)
if [ -z "$A" -o "$A" = " " ]; then
    sleep 10s
    exit 0
fi
cat /chain/finallogs
> /chain/finallogs