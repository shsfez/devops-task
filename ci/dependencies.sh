#!/usr/bin/env sh

set -eu

apk update
# install dependencies
apk add --no-cache \
    bash \
    npm \
    docker-compose \
    zip \
    redis \

#check our versions
npm -v
node -v
docker-compose -v