#!/bin/bash
# author:wang yi

#zabbix server ip
SERVER_IP=$1
#SERVER_IP="192.168.100.6"

#zabbix agent ip
AGENT_IP=`ifconfig  | grep 'inet addr:' | grep -v '127.0.0.1' | grep -v '0.0.0.0' | grep -v '172.' | cut -d: -f2 | awk '{ print $1}'`

function stopZabbixAgent(){
    CONTAINER_ID=$(docker ps -a | grep "zabbix-" | awk '{print $1}')
        if [ ! -z "$CONTAINER_ID" -o "$CONTAINER_ID" = " " ]; then
                docker rm -f $CONTAINER_ID
        fi
}
function checkZabbixAgent(){
	DOCKER_IMAGE_ID=$(docker images | grep "registry.cn-hangzhou.aliyuncs.com/wangyi0559/zabbix-agent" | awk '{print $3}')
        if [ -z "$DOCKER_IMAGE_ID" -o "$DOCKER_IMAGE_ID" = " " ]; then
		    docker pull registry.cn-hangzhou.aliyuncs.com/wangyi0559/zabbix-agent:latest
        fi
}
function startZabbixAgent(){
    checkZabbixAgent
    stopZabbixAgent
    docker run --privileged=true \
    --name zabbix-agent \
    --network=host \
    -e ZBX_HOSTNAME=$AGENT_IP \
    -e ZBX_SERVER_PORT=10051 \
    -e ZBX_SERVER_HOST=$SERVER_IP \
    -e ZBX_UNSAFEUSERPARAMETERS=1 \
    -e ZBX_ENABLEREMOTECOMMANDS=1 \
    -v /dev/sdc:/dev/sdc \
    -v /chain:/chain \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /var/lib/docker:/var/lib/docker \
    -d registry.cn-hangzhou.aliyuncs.com/wangyi0559/zabbix-agent:latest
}
function checkEvalInit(){
	DOCKER_IMAGE_ID=$(docker images | grep "registry.cn-hangzhou.aliyuncs.com/wangyi0559/eval-init" | awk '{print $3}')
        if [ -z "$DOCKER_IMAGE_ID" -o "$DOCKER_IMAGE_ID" = " " ]; then
		    docker pull registry.cn-hangzhou.aliyuncs.com/wangyi0559/eval-init
        fi
}
function initZabbix(){
    checkEvalInit
    docker run --rm --privileged=true \
    --network=host \
    -d registry.cn-hangzhou.aliyuncs.com/wangyi0559/eval-init /bin/bash /init.sh $SERVER_IP $AGENT_IP
}
sleep 5s
startZabbixAgent
sleep 15s
initZabbix