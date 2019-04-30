#!/bin/sh

export HOME=/home/ubuntu

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /home/ubuntu/mplusmuseum-stories
npm i -g npm
npm install
npm run build

pm2 restart mplusmuseum-stories
