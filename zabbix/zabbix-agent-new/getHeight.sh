#!/bin/bash

if [ ! -f "/chain/scripts/getHeight.sh" ]; then
echo ""
exit 0
fi

INIT=$(cat /getheightinit)
if [ $INIT == "0" ]; then
    nohup /bin/bash /chain/scripts/getHeight.sh > /dev/null 2>&1 &
    echo 1 > /getheightinit
    echo ""
    exit 0
fi

cat /height
