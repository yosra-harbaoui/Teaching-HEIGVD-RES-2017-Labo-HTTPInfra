#!/bin/sh

docker run -d res/apache_php
docker run -d res/apache_php
docker run -d res/apache_php

docker run -d --name apache_static res/apache_php

docker run -d res/express_students
docker run -d res/express_students

docker run -d --name express_dynamic res/express_students

ip_static=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' apache_static)
ip_dynamic=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' express_dynamic)

ip_static+=":80"
ip_dynamic+=":3000"

docker run -d -e STATIC_APP=$ip_static -e DYNAMIC_APP=$ip_dynamic --name apache_rp -p 8080:80 res/apache_rp