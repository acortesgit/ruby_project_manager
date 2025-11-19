#!/bin/bash
set -e

# Ensure engines exist before bundle install
if [ ! -d "core" ] || [ ! -d "admin" ]; then
  echo "ERROR: core or admin engines not found!"
  exit 1
fi

# Run bundle install
bundle install

