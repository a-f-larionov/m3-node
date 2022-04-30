# Project Tri_Base 

Project Tri_Base - it is my first Match Three Game!
And it is my first commercial project!
Awesome project - I know it! :)

Projects use it:
 https://vk.com/app7506736

If you want to collaborate or something else, please send me message via:
email: a.f.larionov@gmail.com ;
facebook: https://www.facebook.com/a.f.larionov ;
vkontakte: https://vk.com/a.f.larionov

# Docker

https://docs.docker.com/engine/install/

## Windows

    Download https://www.docker.com/products/docker-desktop/
    docker-compose up


# SSL keys (self signed certificate)
    
    openssl req -x509 -outform PEM -sha256 -nodes -days 365 -newkey rsa:2048 -keyout priv.key -out cert.pem


# Virtual Box 

 Настройки сети : NAT + Virtual Host Adapter 
 192.168.0.1 255.255.255.0
 @todo screenshot here

 netplan generate
 netplan apply
 
 vi /etc/netplan/50-cloud.yaml
 network:
    ethernets:
        enp0s8:
            addresses: [192.168.0.1/24]
            dhcp4: no
        enp0s3:
            dhcp4: true
     version: 2

# Setup server

Ubuntu( Xenial xerus, Bionic Beaver, Focal Fossa )

    apt update
    apt upgrade
    
MySql

    apt install mysql-server
    mysql_secure_installation
    
Nginx

    apt install nginx
        
NodeJs

    apt install nodejs
    apt install npm

# Configure
Nginx
 
 @see other/daemon.files/nginx_sites-enabled/tri_base.conf
 
 ln -s /etc/nginx/sites-available/tri-base.conf /etc/nginx/sites-enabled/
 
Mysql

    CREATE USER 'tri_base'@'%' IDENTIFIED BY 'tri_base';
    GRANT ALL PRIVILEGES ON tri_base.* TO 'tri_base'@'%';
    FLUSH PRIVILEGES;

NodeJs

    cd server/
    npm install
    
PNGQUANT

    apt install pngquant
    
Rename server/config.{hostname}.{projectfolder}.js
Config Database access
Execute Database dump

Certificate it!
https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx

To start server with OS

copy ./other/daemon.files/init.d/tri-base to /etc/init.d/tri-base
sudo chmod 755 /etc/init.d/tri-base
sudo chown root:root /etc/init.d/tri-base
sudo dos2unix /etc/init.d/tri-base
sudo update-rc.d tri-base defaults
sudo update-rc.d tri-base enable
sudo service tri-base start
copy ./other/daemon.files/nginx_sites-enabled/tri-base.conf to /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/tri-base.conf /etc/nginx/sites-enabled/tri-base.conf
nginx -t # for test
systemctl restart nginx

here, folder nginx_sites-enabled - is a /etc/nginx/sites-enabled/
