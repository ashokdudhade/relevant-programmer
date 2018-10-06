---
title: Docker for programmers
date: "2018-10-06T02:13:55.325Z"
---

This blog post covers details on using docker to improve the productivity of programmers.

Why should we use docker?
There are scenarios where we want to test something quickly without installing dependencies on your developer machine. 

Let's take an example of testing a static website on a local machine. 
We many options to do this, such as use nginx, nodejs express etc. Assume we want to use nginx, it would require nginx installation with a version we want. If we have an existing nginx version on a local machine then we would require it to be uninstalled before new version installation.
Here comes docker with the solution, we don't need to uninstall the existing version or install new nginx version on a local machine. Instead, we will be downloading nginx docker image on the local machine. 

```docker pull nginx:1.15.5```

Above command will download nginx 1.15.5 docker image on the local machine.

To test static website build.

```docker run -it -p 3000:80 -v /your-build-dir:/usr/share/nginx/html nginx```

It will start nginx inside docker and host machine can access the site on port 3000(http://localhost:3000). 
