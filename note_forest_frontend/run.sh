#!/bin/bash

export DATABASE_URL="mysql://user:password@host:3306/table_name"
export JWT_SECRET="xxxx"
export JWT_EXPIRES_IN="7d"
export PORT=14000

node .output/server/index.mjs