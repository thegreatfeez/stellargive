#!/bin/bash
# Helper script to fund a Stellar account on testnet
PUBLIC_KEY=$1

if [ -z "$PUBLIC_KEY" ]; then
  echo "Usage: ./fund-testnet.sh <PUBLIC_KEY>"
  exit 1
fi

curl -X GET "https://friendbot.stellar.org/?addr=$PUBLIC_KEY"
