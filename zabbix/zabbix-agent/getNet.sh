#!/bin/bash
AGENT_IP=`ifconfig  | grep 'inet addr:' | grep -v '127.0.0.1' | grep -v '0.0.0.0' | grep -v '172.' | cut -d: -f2 | awk '{ print $1}'`
function getNet(){
    cp /netdat /netdat1
    >/netdat
    sed -i '1d;$d' /netdat1
    awk '{ $1=null;$3=null;$5=null;print }' /netdat1 > /netdat2
    awk '{a[$1" "$2]+=$3;}END{for (i in a) print i,a[i];}' /netdat2>/netdat3
    sed -i -e "/$AGENT_IP/!d" /netdat3
    sed -i "s/$AGENT_IP//g" /netdat3
    cat /netdat3
    rm /netdat1
    rm /netdat2
    rm /netdat3
}
getNet