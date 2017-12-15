#!/bin/bash
AGENT_IP=`ifconfig  | grep 'inet addr:' | grep -v '127.0.0.1' | grep -v '0.0.0.0' | grep -v '172.17.' | cut -d: -f2 | awk '{ print $1}'`
function getNet(){
    cp /chain/netdat /chain/netdat1
    >/chain/netdat
    sed -i '1d;$d' /chain/netdat1
    awk '{ $1=null;$3=null;$5=null;print }' /chain/netdat1 > /chain/netdat2
    awk '{a[$1" "$2]+=$3;}END{for (i in a) print i,a[i];}' /chain/netdat2>/chain/netdat3
    sed -i -e "/$AGENT_IP/!d" /chain/netdat3
    sed -i "s/$AGENT_IP//g" /chain/netdat3
    A=$(cat /chain/netdat3)
    if [ -z "$A" -o "$A" = " " ]; then
        rm /chain/netdat1
        sleep 10s
    fi
    cat /chain/netdat3
    rm /chain/netdat1
}
getNet