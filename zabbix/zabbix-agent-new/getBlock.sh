#!/bin/bash

if [ ! -f "/chain/scripts/getBlock.sh" ]; then
echo ""
exit 0
fi

INIT=$(cat /getblockinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getBlock.sh > /dev/null 2>&1 &
    echo 1 > /getblockinit
    echo ""
    exit 0
fi
echo 1
# HEIGHT=$(cat /height)
# BLOCKNOW=$(cat /getblocknow)

# if test $[BLOCKNOW] -lt $[HEIGHT]
# then
#     NEW=`expr $BLOCKNOW + 1`
#     echo $NEW > /getblocknow
#     cat /chain/data/finalblock$BLOCKNOW
# else
#     echo ""
# fi
