#!/usr/bin/env bash

rm -rf /usr/share/nginx/html.bak
mv /usr/share/nginx/html /usr/share/nginx/html.bak
cp -r ./static /usr/share/nginx/html
find /usr/share/nginx/html -type d -exec chmod 755 {} \;
find /usr/share/nginx/html -type f -exec chmod 644 {} \;

