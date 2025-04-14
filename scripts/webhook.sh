#!/bin/bash

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null
then
    echo "ngrok is not installed. Please install it first."
    echo "npm install -g ngrok"
    exit 1
fi

# Start ngrok tunnel
ngrok http 3000 