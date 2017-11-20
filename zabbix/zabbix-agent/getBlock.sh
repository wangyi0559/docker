#!/bin/bash
function getBlock(){
    HEIGHT=$(cat /height)
    NOW=$(cat /now)
    if test $[NOW] -lt $[HEIGHT]
    then
        NEW=`expr $NOW + 1`
        BLOCK_ID=$NOW
        BLOCK_HEIGHT=`expr $BLOCK_ID + 1`
        RESULT=$(curl -s 127.0.0.1:8080/api/getInfo?blockId=$BLOCK_ID)
        BLOCK_IP=$(cat /chain/AGENT_IP)
        BLOCK_HASH=$(echo $RESULT | jq '.header.data_hash')
        BT_NUM=$(echo $RESULT | jq '.data.data|length')
        BLOCK_TRANSACTIONS="[]"
        for((i=0;i<$BT_NUM;i++));  
        do   
            BT_TRANSACTIONID=$(echo $RESULT | jq ".data.data[$i].payload.header.channel_header.tx_id")
            BT_CREATIONTIME=$(echo $RESULT | jq ".data.data[$i].payload.header.channel_header.timestamp")
            BLOCK_TRANSACTIONS=$(echo $BLOCK_TRANSACTIONS | jq ".[$i].transactionid=$BT_TRANSACTIONID|.[$i].creationtime=$BT_CREATIONTIME")
        done
        echo "{}" | jq ".ip=\"$BLOCK_IP\"|.blockid=\"$BLOCK_ID\"|.height=$BLOCK_HEIGHT|.hash=$BLOCK_HASH|.transactions=$BLOCK_TRANSACTIONS"
        echo $NEW > /now
    else
       sleep 10s
    fi
}
getBlock