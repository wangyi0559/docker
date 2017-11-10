#!/bin/bash
function getHeight(){
    RESULT=$(curl -s 127.0.0.1:8080/api/getAll)
    SUCCESS=$(echo $RESULT | jq ".success" | sed "s/\"//g")
    if [ $SUCCESS == "true" ]
    then
        HEIGHT=$(echo $RESULT | jq ".height" | sed "s/\"//g")
        echo $HEIGHT > /height
        echo $HEIGHT
    else
        sleep 6s
    fi
}
getHeight
