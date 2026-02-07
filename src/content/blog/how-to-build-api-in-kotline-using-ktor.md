---
title: How to build API in kotlin using ktor framework
date: "2020-02-21T02:13:55.325Z"
kind: post
draft: false
path: "/posts/how-to-build-api-in-kotline-using-ktor/"
category: "kotlin"
tags:
  - "kotlin"
  - "ktor"
  - "API"
description: "Guide to build api in kotlin using ktor framework"
---


## Why ktor?
[Ktor](https://ktor.io/) Framework doesn't impose a lot of constraints on what technology a project is going to use logging, templating, messaging, persistent, serializing, dependency injection, etc. Ktor pipeline and API is utilising Kotlin coroutines to provide. All host implementations are using asynchronous I/O facilities to avoid thread blocking.

## What does this post cover?
* How to build api?
* Dependency injection?
* Logging?
* Unit testing?

## Application structure
This post demonstrates TODO api creation using ktor framework.



    ├── build.gradle
    ├── resources
    │   ├── application.conf
    │   └── logback.xml
    ├── settings.gradle
    ├── src
    │   ├── Application.kt
    │   ├── dao
    │   │   ├── DAOFacade.kt
    │   │   ├── Todos.kt
    │   │   └── implementation
    │   │       └── DAOFacadeDatabase.kt
    │   ├── entities
    │   │   └── Todo.kt
    │   ├── routes
    │   │   └── TodoRoutes.kt
    │   └── service
    │       └── TodoService.kt
    └── test
        └── service
            └── TodoServiceTests.kt




* `resources/application.conf` - This file contains configuration information for the api, it uses HACON format. More details on configuration can be found [here](https://ktor.io/servers/configuration.html)

* `resources/logback.xml` - This file has logback configuration for generating application logs

* `src/Application.kt` - Application bootstrap method

* `src/entities/Todo.kt` - Entity used for Todo data

* `src/routes/TodoRoutes.kt` - This file contains all routes related to todo api

* `src/service/TodoService` - This file acts as proxy for now, it would be place add business logic related to specific api call

* `src/dao/implementation/DAOFacadeDatabase` - In memory h2 database store for storing todo data.


This structure will help manage application as it grows, clear separation of application logic from routes makes it easy to understand and maintain application.


## How to build simple api?

Creating a route and exposing it as http endpoint is done via adding `routing` method inside application call with api path + http method.

Example:

Below example exposes endpoint /health and will return "UP" 
```
    routing {
        get("/health") {
            //Send response to calling client
            call.respond("UP")
        }
    }
```

Below example exposes endpoint /todo to post a todo item to the api and read request body, process it and return response

```
routing{
    post("/todo") {
        //Read request body and convert it into entity Todo
        val todo = call.receive<Todo>()
        val resoponse = processTodo(todo)
        //Send response to calling client
        call.respond(response)
    }
}

```

## What frameworks are used in this example?

Below are few library/frameworks we will be using for building this API.

* h2 database - for in-memory database
* logback - for application logging
* guice - for dependency injection
* jetbrains.exposed - for querying database
* mockk - for mocking while unit testing

## How to setup dependency injection using guice?

Bind application instance to Application class and Todo classes. 

```
class MainModule(private val application: Application) : AbstractModule() {
    override fun configure() {
        bind(Application::class.java).toInstance(application)
    }
}

class TodoModule() : AbstractModule() {
    override fun configure() {
        bind(TodoRoutes::class.java).asEagerSingleton()

        val dir = File("build/db")


        val pool = ComboPooledDataSource().apply {
            driverClass = Driver::class.java.name
            jdbcUrl = "jdbc:h2:file:${dir.canonicalFile.absolutePath}"
            user = ""
            password = ""
        }


        val dao: DAOFacade =
            DAOFacadeDatabase(Database.connect(pool))
        dao.init()
        bind(TodoService::class.java).asEagerSingleton()
        bind(DAOFacade::class.java).toInstance(dao)
    }
}
```

Then configure these module to be used in program

```
Guice.createInjector(MainModule(this), TodoModule())
```

## How to install features to the pipeline?
Install ContentNegotiation to setup json response support.

```
    install(ContentNegotiation) {
        register(ContentType.Application.Json, GsonConverter())
    }
```
Install CallLogging - This will enable call logging
```
    install(CallLogging) {
    }
```

Advance call logging for logging context - This would add correlationId and requestId on each api call and add it to MDC. MDC properties will be added to each log message that gets executed for http request. 

```
    val correlationId = "x-client-request-id"
    install(CallLogging) {
        mdc(correlationId) {
            it.request.headers[correlationId]
        }
        mdc("requestId") {
            UUID.randomUUID().toString()
        }
    }
```



If logback is using JSON layout automatically all MDC properties are added in log. If using pattern layout you can specify the MDC property to be added in pattern by using `%X{correlationId}` format.

Example for pattern layout

```

<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>
                %d{HH:mm:ss.SSS} %X{correlationId} %X{requestId} [%t] %-5level %logger{36} - %msg%n
            </Pattern>
        </layout>
    </appender>

```


## How to do unit tests?

Here is example of service unit test by mocking DAO call.

```
import com.relevant.programmer.dao.DAOFacade
import com.relevant.programmer.entities.Todo
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.Test
import kotlin.test.assertEquals

class TodoServiceTests {
    @Test
    fun getAllTodosTest(){
        val todo = Todo(text = "test todo")
        val dao = mockk<DAOFacade>()
        val testUser = "testUser"
        every { dao.findAllTodos(testUser) } returns listOf(todo)
        val service = TodoService(dao)
        val todos = service.getAllTodos(testUser)
        assertEquals(todos, listOf(todo))
        verify { dao.findAllTodos(testUser) }

    }
}
```

Todo api example is available [here](https://github.com/ashokdudhade/ktor-todo) in github repo.
