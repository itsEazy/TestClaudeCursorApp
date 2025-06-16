#!/bin/bash

# Deployment script for TestClaudeCursor app to EC2
EC2_HOST="54.175.108.5"
KEY_PATH="$HOME/.ssh/testclaudecursor-key.pem"
APP_DIR="/home/ec2-user/app"

echo "🚀 Deploying TestClaudeCursor to EC2..."

# Create app directory on server if it doesn't exist
echo "📁 Creating app directory..."
ssh -i $KEY_PATH ec2-user@$EC2_HOST "mkdir -p $APP_DIR"

# Copy source code to server (excluding node_modules and other large files)
echo "📤 Uploading source code..."
rsync -avz --progress -e "ssh -i $KEY_PATH" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'target' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'android/.gradle' \
  --exclude 'android/app/.cxx' \
  --exclude 'android/app/build' \
  --exclude 'ios/build' \
  --exclude '*.apk' \
  ./backend ./frontend ./docker-compose.prod.yml \
  ec2-user@$EC2_HOST:$APP_DIR/

# Build and deploy on server
echo "🐳 Building and starting containers..."
ssh -i $KEY_PATH ec2-user@$EC2_HOST "cd $APP_DIR && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml build && docker-compose -f docker-compose.prod.yml up -d"

# Check status
echo "📊 Checking deployment status..."
ssh -i $KEY_PATH ec2-user@$EC2_HOST "cd $APP_DIR && docker-compose -f docker-compose.prod.yml ps"

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: http://testclaudecursor-alb-1183948507.us-east-1.elb.amazonaws.com"
echo "🔧 Backend API: http://testclaudecursor-alb-1183948507.us-east-1.elb.amazonaws.com/auth/login"