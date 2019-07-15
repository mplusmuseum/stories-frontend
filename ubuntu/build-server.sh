#!/bin/sh

sudo apt-get update
sudo apt-get upgrade -y

# install CodeDeploy Agent
sudo apt-get install ruby -y
sudo apt-get install wget -y

cd /home/ubuntu
wget https://aws-codedeploy-ap-southeast-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

sudo service codedeploy-agent start

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# install node
nvm install node

# install pm2
npm install pm2 -g

# download the source
git clone git@github.com:mplusmuseum/mplusmuseum-stories.git

cd mplusmuseum-stories

# set up env
cp .env.example .env

# install packages
npm install

# build for production
npm run build

# statt process in pm2
pm2 start npm --name "mplusmuseum-stories" -- start

