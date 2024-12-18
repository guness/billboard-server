# billboard-server

[![Build Status](https://travis-ci.com/guness/billboard-server.svg?token=FqAtQLMd7FgKzHtCsnhY&branch=master)](https://travis-ci.com/guness/billboard-server)

## Requirements
- nodejs (minimum 8.x)
- mysql-server
- ffmpeg

---
## Development

### to build

0. create database tables
1. npm install
2. NODE_CONF=stage npm run build --update-env
3. pm2 start ecosystem.config.js --only billboard

### to run later
- pm2 start billboard

### to create user:
1. NODE_CONF=stage node scripts/createUser.js user pass
2. settle userOwner table

### to run migration:
1. NODE_CONF=stage node_modules/db-migrate/bin/db-migrate up
### to revert last migration:
1. NODE_CONF=stage node_modules/db-migrate/bin/db-migrate down
---
## Production

### to build

0. create database tables using create.sql
1. npm install
2. NODE_CONF=production npm run build --update-env
3. pm2 start ecosystem.config.js --only plusboard

### to run later
- pm2 start plusboard

### to create user:
1. NODE_CONF=production node scripts/createUser.js user pass
2. settle userOwner table

### to run migration:
1. NODE_CONF=production node_modules/db-migrate/bin/db-migrate up
### to revert last migration:
1. NODE_CONF=production node_modules/db-migrate/bin/db-migrate down

---
## Common
- pm2 start all
- pm2 stop all
- pm2 logs
- pm2 status