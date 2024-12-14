#!/bin/sh
# Hack to get secrets/env variables passed during runtime to work
# Source: https://www.freecodecamp.org/news/how-to-implement-runtime-environment-variables-with-create-react-app-docker-and-nginx-7f9d42a91d70/
# line endings must be \n, not \r\n !
echo "window._env_ = {" > ./env.js
# This line basically reads the .env file, and for each var, if it exists in the
# runtime environment uses that value, otherwise uses the .env value
# TODO: rename .env to .env.dev or .devenv?
awk -F '=' '{ print $1 ": \"" (ENVIRON[$1] ? ENVIRON[$1] : $2) "\"," }' ./.env >> ./env.js
echo "};" >> ./env.js
