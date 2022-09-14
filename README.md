# Project Tri_base

Production: https://vk.com/app7506736

Contacts: <br>
email: a.f.larionov@gmail.com <br>
facebook: https://www.facebook.com/a.f.larionov <br>
vkontakte: https://vk.com/a.f.larionov

# Run project
<a href="https://docs.docker.com/engine/install/">Instruction to install docker</a>.
<a href="https://www.docker.com/products/docker-desktop">Install on Windows</a>.
After install execute command:

    docker-compose up

## Create SSL keys (self signed certificate)

    openssl req -x509 -outform PEM -sha256 -nodes -days 365 -newkey rsa:2048 -keyout priv.key -out cert.pem

# Install https://certbot.eff.org