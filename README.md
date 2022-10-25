# Project Tri_base

Production: https://vk.com/app7506736

Contacts: <br>
email: a.f.larionov@gmail.com <br>
facebook: https://www.facebook.com/a.f.larionov <br>
vkontakte: https://vk.com/a.f.larionov

# Run project
### 1  - Install 
Docker 

<a href="https://docs.docker.com/engine/install/">Instruction to install docker</a><br>
<a href="https://docs.docker.com/engine/install/ubuntu/">Install on Ubuntu</a><br>
<a href="https://www.docker.com/products/docker-desktop">Install on Windows</a>

### 2 - Git clone

    cd /var/
    git clone --depth 1 https://github.com/a-f-larionov/tri-base.git

### 3 - Install SSL Certificate

#### Create SSL keys (self signed certificate)

Move private and public key to /var/tri-base/keys/self-signed/
For windows use PuTTY Key Generator

    linux:
    openssl req -x509 -outform PEM -sha256 -nodes -days 365 -newkey rsa:2048 -keyout priv.key -out cert.pem

##### Or Install Certbot

    According documentations
    https://certbot.eff.org

### 4 - Upload config
    upload config.prod1.tri-base to /server
    upload config.prod1.tri-base to /client and set ip for wss
    see tempalte Config.TRI_BASE_CONFIG_NAME.tri-base.js

### 5 - Run server

docker-compose.prod.yml add for prod server

    cd /var/tri-base
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up

### 6 - Test

    nginx running
    https://prod-server-1.ru/images/coin.png
    service running
    https://prod-server-1.ru/service/--help

Others:
install npm and nodejs 
https://github.com/nodesource/distributions#debinstall

init database
docker exec -it mysql mysql -u -p 