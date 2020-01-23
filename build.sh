#!/bin/bash

# CHECK NPM & NODE VERSIONS
echo 'npm version:'
npm -v
echo 'node version:'
node -v

# INSTALL ANGULAR CLI
export NG_CLI_ANALYTICS=false
npm install -g @angular/cli > /dev/null

# BUILD THE NODE.JS APP
npm install
npm run build

# BUILD THE ANGULAR APP
cd angular-src
npm install
npm run build-prod

# MERGE ANGULAR-DIST TO NODE DIST DIRECTORY
cd ..
cp -r angular-src/dist dist
mv dist/dist dist/angular-dist

# NOW THE /DIST FOLDER SHOULD CONTAIN BOTH DISTRIBUTIONS

# REMOVE NO NECESSARY FILES FOR DOCKER / TESTS
rm -rf angular-src/ src/ data/ tsconfig.json README.md .gitignore

echo "files left here:"
ls -a

echo "build done"