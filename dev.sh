#!/bin/bash

# Ensure dependencies are installed
echo "Installing dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Run the application
echo "Starting SPK-WP application..."
npm run start:all
