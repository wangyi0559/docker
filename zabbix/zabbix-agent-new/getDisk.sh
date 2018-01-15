#!/bin/bash

if [ ! -f "/chain/scripts/getDisk.sh" ]; then
sleep 10s
exit 0
fi

INIT=$(cat /getdiskinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getDisk.sh > /dev/null 2>&1 &
    echo 1 > /getdiskinit
    sleep 11s
    exit 0
fi

A=$(cat /chain/finaldisk)
if [ -z "$A" -o "$A" = " " ]; then
    sleep 11s
    exit 0
fi
cat /chain/finaldisk
> /chain/finaldisk