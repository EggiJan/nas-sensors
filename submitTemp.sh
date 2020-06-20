#!/bin/bash

set -e

# Expects a .env file in the same directory
export $(cat .env | xargs)

CPU=$(sensors|grep CPUTIN|awk '{print $2}'|awk '{print substr($0,2,4)}')
SYS=$(sensors|grep SYSTIN|awk '{print $2}'|awk '{print substr($0,2,4)}')
TEMP1=$(sensors|grep temp1|awk '{print $2}'|awk '{print substr($0,2,4)}')
FAN1=$(sensors|grep fan1|awk '{print $2}'|awk '{print substr($0,0,5)}')
FAN2=$(sensors|grep fan2|awk '{print $2}'|awk '{print substr($0,0,5)}')

printf "\n`date`"
echo "CPU:" $CPU
echo "SYS" $SYS
echo "TEMP1" $TEMP1
echo "FAN1" $FAN1
echo "FAN2" $FAN2

curl "${SUBMIT_TEMP_ENDPOINT}?secret=${SUBMIT_TEMP_SECRET}&cpu_temp=${CPU}&sys_temp=${SYS}&temp1_temp=${TEMP1}&fan1_speed=${FAN1}&fan2_speed=${FAN2}"