#!/bin/bash

echo '--- Enter client directory'
cd client

echo '--- Install client dependencies'
npm i

echo '--- Build client'
npm run build

echo '--- Enter backend directory'
cd ../backend

echo '--- Install backend dependencies'
npm i

echo '--- Deploy backend'
serverless deploy

echo '--- Deploy client'
serverless client deploy