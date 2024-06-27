#!/bin/sh

source ./src-web/env.sh

# deleting files
echo '[INFO] Deleting app contents...'
rm -r $DEST_DIR

# uninstall icon
echo '[INFO] Uninstalling svg app icon...'
rm $ICON_DIR/scalable/apps/learnforge.svg
gtk-update-icon-cache $ICON_DIR

# uninstall desktop file
echo '[INFO] Uninstalling .desktop file...'
rm $DESKTOP_DIR/learnforge.desktop
