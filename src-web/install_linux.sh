#!/bin/sh

DEST_DIR=/opt/top.ohzyd.learnforge
ICON_DIR=/usr/share/icons/hicolor
DESKTOP_DIR=/usr/share/applications

# build dist
yarn && yarn build

# copy dist to destination
if [ -d $DEST_DIR ]; then
  echo '[INFO] Previous installation detected, deleting old contents...'
  rm -r $DEST_DIR/*
else
  echo '[INFO] Creating target directory...'
  mkdir -p $DEST_DIR
fi
echo '[INFO] Copying app contents...'
cp -r ./dist/* $DEST_DIR/

# install icon
echo '[INFO] Installing svg app icon...'
cp ./dist/icon.svg $ICON_DIR/scalable/apps/learnforge.svg
gtk-update-icon-cache $ICON_DIR

# install desktop file
echo '[INFO] Installing .desktop file...'
cp ./src-web/learnforge.desktop $DESKTOP_DIR/
