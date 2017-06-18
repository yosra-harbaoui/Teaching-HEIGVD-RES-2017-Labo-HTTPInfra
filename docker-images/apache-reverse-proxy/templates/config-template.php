<?php

$DYNAMIC_APP = $_SERVER['DYNAMIC_APP'];
$STATIC_APP = $_SERVER['STATIC_APP'];

?>

<VirtualHost *:80>
        ServerName demo.res.ch

        ProxyPass '/api/cards/' 'http://<?php print "$DYNAMIC_APP" ?>/'
        ProxyPassReverse '/api/cards/' 'http://<?php print "$DYNAMIC_APP" ?>/'

        ProxyPass '/' 'http://<?php print "$STATIC_APP"; ?>/'
        ProxyPassReverse '/' 'http://<?php print "$STATIC_APP"; ?>/'
</VirtualHost>