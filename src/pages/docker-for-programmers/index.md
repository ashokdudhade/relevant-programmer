---
title: Docker for programmers
date: "2018-10-06T02:13:55.325Z"
---

This post covers details on using docker to improve the productivity of programmers.

Why should we use docker?
There are scenarios where we want to test things quickly without installing dependencies on your developer machine. Docker comes handy in situations like this, its only matter of downloading an image and running it.

Let's take an example of testing a static website on a local machine. Usually when we develop a web application using react, angular, vuejs etc. webpack is used to the server locally. There would be unfortunate scenarios where actual build would behave differently than the local serving. So to avoid such issue we can test the static website build by running it locally.

We have multiple options to do this, such as use nginx, nodejs express etc. Let's take an example of using nginx, it would require nginx installation with a version we want. 

```docker pull nginx:1.15.5```

Above command will download nginx 1.15.5 docker image on the local machine.

To test static website build.

```docker run -it -p 3000:80 -v /your-build-dir:/usr/share/nginx/html nginx```

It will start nginx inside docker and host machine can access the site on port 3000(http://localhost:3000). 

Now, let's look at another scenario assume we have docker container running on a machine and suddenly it stopped the container. How do we know what happened in the container to stop it?

First thing is to identify the container id, below command should display all containers.

```
docker ps -a
```

* View docker logs

    ```
    docker logs <<containerId>>
    ```
    It's fairly simple to view logs using above command.

* View log file inside stopped docker container

    In some cases,```docker logs``` might not be sufficient enough to provide details on exactly what happens. The application might generate logs file at some directory inside the container. If you want to view those logs files from stopped container then we need to copy the file from a stopped container to host machine. Below command could be handy.

    ```
    docker cp <containerId>:/file/path/within/container /host/path/target

    ```
