#!/bin/bash

if [ ! -f "/chain/scripts/getDisk.sh" ]; then
echo ""
exit 0
fi

INIT=$(cat /getdiskinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getDisk.sh > /dev/null 2>&1 &
    echo 1 > /getdiskinit
    echo ""
    exit 0
fi

A=$(cat /chain/data/finaldisk)
if [ -z "$A" -o "$A" = " " ]; then
    echo ""
    exit 0
fi
cat /chain/data/finaldisk
> /chain/data/finaldisk