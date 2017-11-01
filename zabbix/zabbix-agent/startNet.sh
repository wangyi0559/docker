#!/bin/bash
ETH_ID=$(ifconfig -s | awk '{print $1}' | grep "^e")

nohup tcpdump -qn  -i $ETH_ID  port not  22  > /netdat 2>&1 &