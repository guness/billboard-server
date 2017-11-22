# billboard-server

[![Build Status](https://travis-ci.com/guness/billboard-server.svg?token=FqAtQLMd7FgKzHtCsnhY&branch=master)](https://travis-ci.com/guness/billboard-server)

to build for stage:

NODE_CONF=stage npm run build
pm2 restart billboard

to build for production:
NODE_CONF=production npm run build
pm2 restart plusboard

to run:
1. npm install
2. npm run build
3. npm start

to create user:
1. NODE_ENV=production node server/__createUser.js user pass
2. settle Owner and userOwner ids


---
to launch production with PM2

  pm2 start ecosystem.config.js

to launch development with PM2

  pm2 start ./server/index.js
