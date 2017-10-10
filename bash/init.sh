#!/bin/bash

#server ip
SERVER_IP=$1
#agent ip
AGENT_IP=$2
#eth_id
ETH_ID=$(ifconfig -s | awk '{print $1}' | grep "^e")
echo $ETH_ID
# login
AUTH=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\":\"2.0\",
        \"method\":\"user.login\",
        \"params\":{
            \"user\":\"Admin\",
            \"password\":\"zabbix\"
            },
        \"auth\":null,
        \"id\":0
    }")
AUTH=$(echo $AUTH | jq ".result" | sed "s/\"//g")

#add agent
HOST_ID=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\":\"2.0\",
        \"method\":\"host.create\",
        \"params\":{
            \"host\":\"$AGENT_IP\",
            \"interfaces\":[
                {
                    \"type\":1,
                    \"main\":1,
                    \"useip\":1,
                    \"ip\":\"$AGENT_IP\",
                    \"dns\":\"\",
                    \"port\":\"10050\"
                }
            ],
            \"groups\":[
                {
                    \"groupid\":\"2\"
                }
            ],
            \"inventory_mode\":-1
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")
HOST_ID=$(echo $HOST_ID | jq ".result.hostids[0]" | sed "s/\"//g")

sleep 10

#get interface id
INTERFACE_ID=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"hostinterface.get\",
        \"params\": {
            \"output\": \"extend\",
            \"hostids\": \"$HOST_ID\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")
INTERFACE_ID=$(echo $INTERFACE_ID | jq ".result[0].interfaceid" | sed "s/\"//g")
#add items

#agent.hostname
HOSTNAME=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"Host name of zabbix_agentd running\",
            \"key_\": \"agent.hostname\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 1,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#system.boottime
BOOTTIME=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"Host boot time\",
            \"key_\": \"system.boottime\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 3,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#Total memory
TOTAL_MEMORY=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"Total memory\",
            \"key_\": \"vm.memory.size[total]\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 3,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#net input and output for every eth
for eth in $ETH_ID
do
    #Incoming network traffic
    NET_IN=$(curl -s -X POST \
        $SERVER_IP/api_jsonrpc.php \
        -H 'Content-Type:application/json' \
        -d "{
            \"jsonrpc\": \"2.0\",
            \"method\": \"item.create\",
            \"params\": {
                \"name\": \"Incoming network traffic on $eth\",
                \"key_\": \"net.if.in[$eth]\",
                \"hostid\": \"$HOST_ID\",
                \"type\": 0,
                \"value_type\": 3,
                \"interfaceid\": \"$INTERFACE_ID\",
                \"delay\": \"5s\"
            },
            \"auth\":\"$AUTH\",
            \"id\":0
        }")
    #Incoming network traffic
    NET_OUT=$(curl -s -X POST \
        $SERVER_IP/api_jsonrpc.php \
        -H 'Content-Type:application/json' \
        -d "{
            \"jsonrpc\": \"2.0\",
            \"method\": \"item.create\",
            \"params\": {
                \"name\": \"Outgoing network traffic on $eth\",
                \"key_\": \"net.if.out[$eth]\",
                \"hostid\": \"$HOST_ID\",
                \"type\": 0,
                \"value_type\": 3,
                \"interfaceid\": \"$INTERFACE_ID\",
                \"delay\": \"5s\"
            },
            \"auth\":\"$AUTH\",
            \"id\":0
        }")
done

#Processor load (5 min average per core)
PROCESSOR_LOAD=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"Processor load (5 min average per core)\",
            \"key_\": \"system.cpu.load[percpu,avg5]\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 0,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#Available memory
AVAILABLE_MEMORY=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"Available memory\",
            \"key_\": \"vm.memory.size[available]\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 3,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#fabric height info
FABRIC_HEIGHT=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"fabric height info\",
            \"key_\": \"fabric.height\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 3,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#fabric channel info
FABRIC_CHANNEL=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"fabric channel info\",
            \"key_\": \"fabric.channel\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 1,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")

#fabric block info
FABRIC_BLOCK=$(curl -s -X POST \
    $SERVER_IP/api_jsonrpc.php \
    -H 'Content-Type:application/json' \
    -d "{
        \"jsonrpc\": \"2.0\",
        \"method\": \"item.create\",
        \"params\": {
            \"name\": \"fabric block info\",
            \"key_\": \"fabric.block\",
            \"hostid\": \"$HOST_ID\",
            \"type\": 0,
            \"value_type\": 4,
            \"interfaceid\": \"$INTERFACE_ID\",
            \"delay\": \"5s\"
        },
        \"auth\":\"$AUTH\",
        \"id\":0
    }")
