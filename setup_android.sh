#!/bin/bash
set -e
export ANDROID_HOME=/opt/android
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

echo "Downloading cmdline-tools..."
mkdir -p /opt/android/cmdline-tools
cd /tmp
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdline-tools.zip
unzip -q cmdline-tools.zip
mv cmdline-tools /opt/android/cmdline-tools/latest

echo "Accepting licenses..."
yes | sdkmanager --licenses > /dev/null

echo "Installing SDK components..."
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" > /dev/null

echo "Android SDK setup complete."
