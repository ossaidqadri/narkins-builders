#!/bin/bash

echo " Starting TinaCMS Local Development"
echo "=================================="

# Check if environment variables are set
if [[ -z "$NEXT_PUBLIC_TINA_CLIENT_ID" ]]; then
    echo "❌ Missing NEXT_PUBLIC_TINA_CLIENT_ID in .env.local"
    echo "Please add your TinaCMS client ID to .env.local"
    exit 1
fi

if [[ -z "$TINA_TOKEN" ]]; then
    echo "❌ Missing TINA_TOKEN in .env.local"
    echo "Please add your TinaCMS token to .env.local"
    exit 1
fi

echo " Environment variables found"
echo " Starting TinaCMS development server..."

# Start TinaCMS development server
bun run dev