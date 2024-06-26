#!/bin/sh

# build dist
yarn && yarn build

# start server
python -m http.server -d ./dist
