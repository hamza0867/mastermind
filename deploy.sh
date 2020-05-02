#!/usr/bin/env sh

# abort on errors
set -e

# build
VUE_APP_API_URL=https://mastermind-backend-nodejs.herokuapp.com yarn build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:hamza0867/mastermind.git master:gh-pages

cd -
