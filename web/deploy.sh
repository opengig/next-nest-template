#!/bin/bash

REPO=$(hostname)
DEVTOOLS_SECRET="$1"  # Get secret from first argument

cd "$HOME/$REPO"
sudo su
git pull
npm install

# Fetch env file from API using the passed secret
ENV_CONTENT=$(curl -X POST \
  "https://tools-backend.dev.opengig.work/development/${REPO}/env" \
  -H "Content-Type: application/json" \
  -d "{\"apiKey\": \"${DEVTOOLS_SECRET}\"}")

# Write env content directly to file
echo "$ENV_CONTENT" > .env
npm run build

pm2 describe website > /dev/null 2>&1
STATUS=$?

if [ $STATUS -eq 0 ]; then
    echo "PM2 process 'website' is running. Restarting it..."
    pm2 restart website
else
    echo "PM2 process 'website' is not running. Starting a new process..."
    pm2 start npm --name website -- start
fi

pm2 save
