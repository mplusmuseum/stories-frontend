#!/bin/sh

export HOME=/home/ubuntu

cd /usr/local/mplusmuseum/projects/mplusmuseum-stories
sudo npm i -g npm
sudo npm install
sudo npm run build

pm2 restart mplusmuseum-stories
