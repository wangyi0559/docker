#!/bin/bash
function getNet(){
    cp /netdat /netdat1
    >/netdat
    cat /netdat1
    rm /netdat1
}
getNet