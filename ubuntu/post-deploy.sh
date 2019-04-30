#!/bin/sh

export HOME=/home/ubuntu

cd /usr/local/mplus/mplusmuseum-stories
npm i -g npm
npm install
npm run build

pm2 restart mplusmuseum-stories
