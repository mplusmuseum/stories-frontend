#!/bin/sh

export HOME=/home/ubuntu
sudo -i -u ubuntu bash << EOF

cd /home/ubuntu/mplusmuseum-stories
npm i -g npm
npm install
npm run build

pm2 restart mplusmuseum-stories
EOF
