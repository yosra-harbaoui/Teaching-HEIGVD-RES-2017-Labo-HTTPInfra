# Teaching-HEIGVD-RES-2017-Labo-HTTPInfra Report

Yosra Harbaoui  
June, 2017

## Introduction
The first objective of this lab is to get familiar with software tools that will allow us to build a **complete web infrastructure**. By 
that, we mean that we will build an environment that will allow us to serve **static and dynamic content** to web browsers. To do that, 
we will see that the **apache httpd server** can act both as a **HTTP server** and as a **reverse proxy**. We will also see 
that **express.js** is a JavaScript framework that makes it very easy to write dynamic web apps.

The second objective is to implement a simple, yet complete, **dynamic web application**. We will create **HTML**, **CSS** and
**JavaScript** assets that will be served to the browsers and presented to the users. The JavaScript code executed in the browser 
will issue asynchronous HTTP requests to our web infrastructure (**AJAX requests**) and fetch content generated dynamically.

The third objective is to practice our usage of **Docker**. All the components of the web infrastructure will be packaged in custom Docker 
images (we will create at least 3 different images).  

In this report, we will document our configurations and explain how to use the different created images.

### Step 0: Installation
* You have installed **docker** 
* You have to clone [this repository](https://github.com/yosra-harbaoui/Teaching-HEIGVD-RES-2017-Labo-HTTPInfra) on your local machine.
* Every step on this porject is created on a different branch. Every time you want to use one of the steps, you have to use :  
`git checkout [branch name]`

### Step 1: Static HTTP server with apache httpd
We had to look for an official Docker image of a Web server with Apache and PHP, we found it [here](https://hub.docker.com/_/php/).
Under this link, we found an offical Dockerfile that we copied on ower Dockerfile that we created on our "docker-images" that 
contains an "apache-php-image" folder.  
```Dockerfile
FROM php:7.0-apache
COPY src/ /var/www/html/
```
`FROM php:7.0-apache` : php version 
`COPY src/ /var/www/html/` :  copy local files inside every created container  

First, you have to create a container from by using the following command.
```run
docker run -d -p 9090:80 php:7.0-apache
```
To test if the container is running correctly, you can lanch a **Shell** and type :
```telnet
telnet [IP address] 9090
GET / HTTP/1.0
```
`[IP address]` : The address of your Docker machine. If you are using Docker ToolBox, your address is `192.168.99.100`.

Second, we created the file index.html to create an HTML page using a page theme from [Start Bootstrap](https://startbootstrap.com/).

And finally, you can use your favorite browser to see the page by looking for `[IP address]:9090`.

## Step 2: Dynamic HTTP server with express.js

we will create a new folder **express-image** with a new Dockerfile using **node.js**. We used an official image found on DockerHub : [node:6.10](https://hub.docker.com/_/node/). We copied the dockerfile on ower folder.
```Dockerfile
FROM node:6.11
COPY src /opt/app
CMD ["node", "/opt/app/index.js"]
```

`FROM node:6.11` : node js version
`COPY src /opt/app` : copy local files inside every created container 
`CMD ["node", "/opt/app/index.js"]` : the first command executed when a container is lanched

To create our application: 
1. we installed express, the npm module using `npm install --save express`. 
2. We used express in our index.js file :
```express
var express = require('express');
var app = express();
```
3. we created an application that generate an array of credit cards: type and number of credit card.

To use the application, you can use `node index.js` to build `res/express_students` image.
You can test if the container is running correctly by using one of this methods:
1. You can lanch a **Shell** and type :
``` telnet
telnet 127.0.0.1 3000
GET / HTTP/1.0
```
However, you can access to the application from your local host.  

2.  You can type:
```run with mapping
docker run -p 9090:3000 res/express_students
```
And then, you can use your favorite browser to see the page by looking for `[IP address]:9090` (and refresh).

## Step 3: Reverse proxy with apache (static configuration)
We configured an Apache server as a reverse proxy to be used as a unique entrance to both of the containers we created in steps 1 and 2.  
first, we run ower two container `apache_static` and `express_student` by giving each one a name. 
```run containers
docker run -d --name apache_static res/apache_php
docker run -d --name express_dynamic res/express_students
```
we can get their IP addresses by :

```IP addresses
docker inspect apache_static | grep -i ipaddress 
docker inspect express_dynamic | grep -i ipaddress 
```
Second, you can access to the container's filesystem by :
```filesystem
docker run -it -p 8080:80 php:7.0-apache /bin/bash
```
and type the following commands:
```commands
cd /etc/apache2
cd sites-available/
cp 000-default.conf 001-reverse-proxy.conf
apt-get update
apt-get install vim
vi 001-reverse-proxy.conf
```
Then, we will write the following lines inside `001-reverse-proxy.conf`:
```001-reverse-proxy.conf
<VirtualHost *:80>
        ServerName demo.res.ch

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined

        ProxyPass "/api/students/" "http://172.17.0.3:3000/"
        ProxyPassReverse "/api/students/" "http://172.17.0.3:3000/"

        ProxyPass "/" "http://172.17.0.2:80/"
        ProxyPassReverse "/" "http://172.17.0.2:80/"
</VirtualHost>
```

And we will write the following lines inside  `000-default.conf`:
```000-default.conf
<VirtualHost *:80>
</VirtualHost>
```
finally, you can type the follwing commands:
```modules
a2ensite 001*
a2enmod proxy
a2enmod proxy_http
service apache2 restart
service apache2 reload
```

for testing, you can lanch a **Shell** and type: 
```telnet
telnet [IP address] 8080
GET / HTTP/1.0
Host : demo.res.ch
```

If you want to use this on your browser, you have to add `127.0.0.1 demo.res.ch --> http://demo.res.ch:8080/` to `etc\hosts` and then you type:
- `demo.res.ch:8080/api/cards/` : to access to the credit cards list.
- `demo.res.ch:8080` : to access to the website.

## Step 4: AJAX requests with JQuery
We used **JQuery library** to implement an **AJAX request**.

First, we modified the Dockerfile of `apache-php-image`.
```dockerfile
FROM php:7.0-apache
RUN apt-get update && apt-get install -y vim
COPY src/ /var/www/html/
```
`RUN apt-get update && apt-get install -y vim` : install automatically Vim 

You can build three images we had created previously by:
```build
docker run -d --name apache_static res/apache_php
docker run -d --name express_dynamic res/express_students
docker run -d -p 8080:80 --name apache_rp res/apache_rp
```

we can get their IP addresses by :

```IP addresses
docker inspect apache_static | grep -i ipaddress 
docker inspect express_dynamic | grep -i ipaddress 
```
Second, we modified our `index.html` by using the following commands:
```modifing index.html
docker exec -it apache_static /bin/bash
cp index.html index.html.orig
vi index.html
cd js
touch creditcards.js
vi creditcards.js
```
The new application will offers us to change the credit cards automatically every two seconds.

To test the new application feature, you can type :
```new feature
docker build -t res/apache_php .
docker kill apache_static
docker rm apache_static
docker run -d --name apache_static res/apache_php
```
You can test the new feature, you can use your favorite browser to see the page by looking for `demo.res.ch:8080`
