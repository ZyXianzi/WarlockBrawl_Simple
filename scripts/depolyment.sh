#! /bin/bash

cd ~/Warlock/

sudo /etc/init.d/nginx start  # 启动nginx服务

sudo redis-server /etc/redis/redis.conf  # 启动radis-server服务

uwsgi --ini scripts/uwsgi.ini  # 启动uwsgi服务

daphne -b 0.0.0.0 -p 5015 Warlock.asgi:application  # 启动django_channels服务

match_system/src/main.py  # 启动匹配服务