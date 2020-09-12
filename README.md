<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
 Para hacer funcionar proyecto requiere utilizar el siguiente codigo mediante terminal
 Requeire NODE.JS

 ```
  npm install
 ```

 **Rutas de uso**

> localhost:5004/api/auth/signup

 ```
 Consulta mediante metodo HTTP - POST
  {
    "username":"cesar2",
    "email":"cesar2@correo.cl",
    "password":"1234568"
}

 ```




> localhost:5004/api/auth/signin

 ```
 Consulta mediante metodo HTTP - POST
{
    "username":"cesar",
    "password":"123456"
}

Response
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJjZXNhckBjb3JyZW8uY2wiLCJ1c2VybmFtZSI6ImNlc2FyIiwicm9sZXMiOltdLCJpYXQiOjE1OTk5MzE0ODEsImV4cCI6MTU5OTkzNTA4MX0.wH_a9R_ip6mKE5hW9oVgyw-SHs0NdobGnGs4EyTR2hc",
    "message": "OK",
    "status": true
}

 ```