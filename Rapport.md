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
Under this link, we found an offical Docker file that we copied on ower Dockerfile that we created on our "docker-images" that 
contains an "apache-php-image" folder.  
```Dockerfile
FROM php:7.0-apache
COPY src/ /var/www/html/
```
`FROM php:7.0-apache` : php version 
`COPY src/ /var/www/html/` :  copy files inside every created container  

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


