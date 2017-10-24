#!/bin/bash
function getStatus(){
    HEIGHT=$(cat /height)
    STATUS=$(cat /status)
    DOCKER_CONTAINER_NUM=$(docker ps | awk '{++num}END{print num }')
    DOCKER_CONTAINER_ALL=$(docker ps -a | awk '{++num}END{print num }')
    if [ $DOCKER_CONTAINER_NUM == $DOCKER_CONTAINER_ALL ]
    then
        echo $STATUS
    elif [ $HEIGHT == "-2" ] 
    then
        echo $STATUS
    else
        #STATUS="5"
        #echo $STATUS > /status
        echo $STATUS
    fi
}
getStatus