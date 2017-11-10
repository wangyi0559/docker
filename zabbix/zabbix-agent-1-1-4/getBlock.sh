#!/bin/bash
function getBlock(){
    HEIGHT=$(cat /height)
    NOW=$(cat /now)
    if test $[NOW] -lt $[HEIGHT]
    then
        RESULT=$(curl -s 127.0.0.1:8080/api/getInfo?blockId=$NOW)
        NEW=`expr $NOW + 1`
        echo $NEW > /now
        echo $RESULT
    else
       sleep 10s
    fi
}
getBlock