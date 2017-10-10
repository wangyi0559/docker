#!/bin/bash
function getChannel(){
    RESULT=$(curl -s 127.0.0.1:8080/api/getChannels)
    echo $RESULT
}
getChannel