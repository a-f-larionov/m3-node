# Project Node-Framework

Project Node-Framework - is just framework for node.

Projects use it:
 https://vk.com/krestik.nolik

If you want to collaborate or something else, please send me message via:
skype: a.f.larionov ;
email: a.f.larionov@gmail.com ;
facebook: https://www.facebook.com/a.f.larionov ;
vkontakte: https://vk.com/a.f.larionov .


# Requirments

MySql
Nginx

# Installation

Worked on Ubuntu 16.04 Xenial Trust

To start server with OS

1 copy ./other/daemon.files/init.d/node-framework to /etc/init.d/node-framework
2 sudo chmod 755 /etc/init.d/node-framework
3 sudo chown root:root /etc/init.d/node-framework
4 sudo update-rc.d node-framework defaults
5 sudo update-rc.d node-framework enable
6 sudo service node-framework start

You can rename node-framework to your project name and then edit file /etc/init.d/node-framework,
replace all 'node-framework' to your project name.

7 copy ./other/daemon.files/nginx_sites-enabled/node-framework.conf to /etc/nginx/sites-available
8 sudo ln -s /etc/nginx/sites-available/node-framework.conf /etc/nginx/sites-enabled/node-framework.conf
9 nginx -t # for test
10 systemctl restart nginx

nginx_sites-enabled - /etc/nginx/sites-enabled/