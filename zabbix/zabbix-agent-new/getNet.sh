#!/bin/bash

if [ ! -f "/chain/scripts/getNet.sh" ]; then
sleep 10s
exit 0
fi

INIT=$(/getnetinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getNet.sh > /dev/null 2>&1 &
    echo 1 > /getnetinit
    sleep 10s
    exit 0
fi

A=$(cat /chain/finalnet)
if [ -z "$A" -o "$A" = " " ]; then
    sleep 10s
    exit 0
fi
cat /chain/finalnet
> /chain/finalnet