#!/bin/bash
function getNet(){
    cp /netdat /netdat1
    >/netdat
    sed -i '1d;$d' /netdat1
    cat /netdat1
    rm /netdat1
}
getNet