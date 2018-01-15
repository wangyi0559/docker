#!/bin/bash

if [ ! -f "/chain/scripts/getBlock.sh" ]; then
sleep 10s
exit 0
fi

INIT=$(cat /getblockinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getBlock.sh > /dev/null 2>&1 &
    echo 1 > /getblockinit
    sleep 10s
    exit 0
fi

HEIGHT=$(cat /height)
BLOCKNOW=$(cat /getblocknow)

if test $[BLOCKNOW] -lt $[HEIGHT]
then
    NEW=`expr $BLOCKNOW + 1`
    echo $NEW > /getblocknow
    cat /chain/finalblock$BLOCKNOW
    rm /chain/finalblock$BLOCKNOW
else
    sleep 10s
fi
