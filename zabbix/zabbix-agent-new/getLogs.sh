#!/bin/bash
# author:wang yi

if [ ! -f "/chain/scripts/getLogs.sh" ]; then
echo ""
exit 0
fi

INIT=$(cat /getlogsinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getLogs.sh > /dev/null 2>&1 &
    echo 1 > /getlogsinit
    echo ""
    exit 0
fi

A=$(cat /chain/finallogs)
if [ -z "$A" -o "$A" = " " ]; then
    echo ""
    exit 0
fi
cat /chain/finallogs
> /chain/finallogs