webpackJsonp([405421393667],{389:function(e,t){e.exports={data:{site:{siteMetadata:{title:"relevant programmer",subtitle:"Full stack software engineer",author:{name:"Ashok Dudhade",twitter:"ashokdudhade"},disqusShortname:"",url:"https://www.relevantprogrammer.com"}},markdownRemark:{id:"/Users/ashokdudhade/os/relevant-programmer/src/pages/articles/2018-10-06---Docker for programmers/index.md absPath of file >>> MarkdownRemark",html:'<p>This post covers details on using docker to improve the productivity of programmers.</p>\n<h2>Why should we use docker?</h2>\n<p>There are scenarios where we want to test things quickly without installing dependencies on your developer machine. Docker comes handy in situations like this, its only matter of downloading an image and running it.</p>\n<p>Let’s take an example of testing a static website on a local machine. Usually when we develop a web application using react, angular, vuejs etc. webpack is used to the server locally. There would be unfortunate scenarios where actual build would behave differently than the local serving. So to avoid such issue we can test the static website build by running it locally.</p>\n<p>We have multiple options to do this, such as use nginx, nodejs express etc. Let’s take an example of using nginx, it would require nginx installation with a version we want. </p>\n<p><code class="language-text">docker pull nginx:1.15.5</code></p>\n<p>Above command will download nginx 1.15.5 docker image on the local machine.</p>\n<p>To test static website build.</p>\n<p><code class="language-text">docker run -it -p 3000:80 -v /your-build-dir:/usr/share/nginx/html nginx</code></p>\n<p>It will start nginx inside docker and host machine can access the site on port 3000(<a href="http://localhost:3000">http://localhost:3000</a>). </p>\n<p>Now, let’s look at another scenario assume we have docker container running on a machine and suddenly it stopped the container. How do we know what happened in the container to stop it?</p>\n<p>First thing is to identify the container id, below command should display all containers.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">docker ps -a</code></pre>\n      </div>\n<ul>\n<li>\n<p>View docker logs</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">docker logs &lt;&lt;containerId&gt;&gt;</code></pre>\n      </div>\n<p>It’s fairly simple to view logs using above command.</p>\n</li>\n<li>\n<p>View log file inside stopped docker container</p>\n<p>In some cases,<code class="language-text">docker logs</code> might not be sufficient enough to provide details on exactly what happens. The application might generate logs file at some directory inside the container. If you want to view those logs files from stopped container then we need to copy the file from a stopped container to host machine. Below command could be handy.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">docker cp &lt;containerId&gt;:/file/path/within/container /host/path/target</code></pre>\n      </div>\n</li>\n</ul>',fields:{tagSlugs:["/tags/docker/","/tags/web-development/"]},frontmatter:{title:"Docker for programmers",tags:["Docker","Web Development"],date:"2018-10-06T02:13:55.325Z",description:"This post covers details on using docker to improve the productivity of programmers."}}},pathContext:{slug:"/posts/docker-for-programmers/"}}}});
//# sourceMappingURL=path---posts-docker-for-programmers-669711c67b2d8b5e1faa.js.map