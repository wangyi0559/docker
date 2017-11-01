#!/bin/bash
ETH_ID=$(ifconfig -s | awk '{print $1}' | grep "^e")

#nohup tcpdump -qn  -i $ETH_ID  port not  22  > /netdat 2>&1 &

nohup tcpdump -qtn  -i $ETH_ID 'tcp port not 22 and port not 10050 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)' > /netdat 2>&1 &