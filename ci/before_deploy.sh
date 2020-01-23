#!/usr/bin/env sh

apk update
apk add --no-cache \
        npm \
        zip \

# clean npm for production only
npm prune --production

# add flag only=production in dockerfile
sed -i -e 's/npm install/npm install --only=production/g' Dockerfile

# save relevant files from project in zip file to directory deply
zip ${PRODUCTION_BUCKET_NAME}_prod_${BITBUCKET_BUILD_NUMBER} \
    Dockerfile \
    dist \
    docker-compose.yml \
    package-lock.json \
    package.json \

# move zip file to a folder called deploy
mkdir -p deploy
mv ${PRODUCTION_BUCKET_NAME}_prod_${BITBUCKET_BUILD_NUMBER}.zip deploy/