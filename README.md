# Project Tri_Base 

Project Tri_Base - it is my first Match Three game!
And it is my first commercial project!
Awesome project - I know! :)

Projects use it:
 https://vk.com/app6221265

If you want to collaborate or something else, please send me message via:
email: a.f.larionov@gmail.com ;
facebook: https://www.facebook.com/a.f.larionov ;
vkontakte: https://vk.com/a.f.larionov

# Setup server

Ubuntu

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
Mysql

    CREATE USER 'tri_base'@'%' IDENTIFIED BY 'tri_base';
    GRANT ALL PRIVILEGES ON tri_base.* TO 'tri_base'@'%';
    FLUSH PRIVILEGES;

NodeJs
    cd server/
    npm install
    
Rename server/config.{hostname}.{projectfolder}.js
Config Database access
Execute Database dump

Certificate it!
https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx

To start server with OS

1 copy ./other/daemon.files/init.d/tri_base to /etc/init.d/tri_base
2 sudo chmod 755 /etc/init.d/tri_base
3 sudo chown root:root /etc/init.d/tri_base
4 sudo update-rc.d tri_base defaults
5 sudo update-rc.d tri_base enable
6 sudo service tri_base start
7 copy ./other/daemon.files/nginx_sites-enabled/tri_base.conf to /etc/nginx/sites-available
8 sudo ln -s /etc/nginx/sites-available/tri_base.conf /etc/nginx/sites-enabled/tri_base.conf
9 nginx -t # for test
10 systemctl restart nginx

here nginx_sites-enabled - is a /etc/nginx/sites-enabled/