#!/bin/bash

ROOT=$(pwd)
PUBLIC=$(echo "$ROOT/public")

# Domain
while true; do
    read -p "Domain: " DOMAIN

    if [ ! -e $DOMAIN ]; then
        break
    fi
done

# Port
while true; do
    read -p "Express port: " PORT

    if [ ! -e $PORT ]; then
        break
    fi
done

# Create from template
cd nginx
ls -lha
cp -f ./domain.template.conf ./$DOMAIN.conf
cp -f ./include.template.conf ./include.conf

sed -i "s#%DOMAIN%#$DOMAIN#g" ./$DOMAIN.conf
sed -i "s#%ROOT%#$ROOT#g" ./$DOMAIN.conf

sed -i "s#%PUBLIC%#$PUBLIC#g" ./include.conf
sed -i "s#%PORT%#$PORT#g" ./include.conf

# Create symlink to nginx config
cd /etc/nginx/sites-enabled
rm default > /dev/null 2>&1
rm $DOMAIN.conf > /dev/null 2>&1
ln -s $ROOT/nginx/$DOMAIN.conf .
cd -

# Install certbot (snap)
# https://snapcraft.io/docs/installing-snapd
apt -qq -y install snapd
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
certbot --nginx -d $DOMAIN
certbot install --nginx -d $DOMAIN
# certbot renew --dry-run

# Reload
nginx -t && nginx -s reload
