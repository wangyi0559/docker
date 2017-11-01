#!/bin/bash
function getNet(){
    cp /netdat /netdat1
    >/netdat
    sed -i '/tcp 0/d' /netdat1
    cat /netdat1
    rm /netdat1
}
getNet