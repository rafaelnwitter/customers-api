#!/bin/bash
echo $DIR
openssl req -x509 -days 1825 -nodes -newkey rsa:1024 -keyout key.pem -out cert.pem -subj `$PWD/src/resources/` -config `\$HOME/openssl.cnf`
