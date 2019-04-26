---
title: React hooks app structure
date: "2019-04-20T02:13:55.325Z"
layout: post
draft: false
path: "/posts/todo-with-react-hooks/"
category: "React"
tags:
  - "React"
  - "React hooks"
  - "Web Development"
description: "It a guide to write react hooks application without using recompose or redux dependencies"
---

## Why react hooks?
[React hooks](https://reactjs.org/docs/hooks-intro.html) is a modern way to write the logic in react components without introducing unnecessary nesting of components in the component tree. It simplifies the component structure and makes it easy to read and maintain.


## Why not recompose?
Recompose library is the awesome framework which helps write react application using higher order component but unfortunately 
[recompose is discontinuing](https://github.com/acdlite/recompose#a-note-from-the-author-acdlite-oct-25-2018) and react hooks is supposed to help to solve problems in a better way.

## What does this article cover?
A new way of writing react application using react hooks and structure of the app. We will build a standard todo application and structure it to make readable. At the high level below is the structure of the todo app.

```
└── src
    ├── api
    ├── components
    ├── hooks
    ├── providers
    └── reducers
```
This structure could be used for any kind of react app.

* api

    This directory will have all methods which make calls to an API.
* components

    This directory consists all react UI components
* hooks

     This directory has all logic needed for components to handle actions and data passing, manipulations and component lifecycle.
* providers

    This directory contains all context API providers for react app
* reducers

    This directory has all reducers which help manages state via actions



Let's start creating Todo app

```
create-react-app todo-with-hooks
```

Create an application level store for managing todo items state.

App.js
```  
import React, {useReducer} from 'react';

const initialState = {
  todoItems: []
};

const store = useReducer(todoReducer, initialState);
```

todoReducer.js is reducer function which doesn't have any state in it, its idempotent function. It's the same as a redux reducer, but we are not using redux in this application
```
const markItemStateChange = (isComplete, id, state) => {
    const item = state.todoItems.find(t => t.id === id);
    if(item){
      item.isComplete = isComplete;
      return {
        ...state, 
        todoItems: [...state.todoItems]
      }
    }
    return state;
  }
  
 export const todoReducer = (state, action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        return {
          ...state,
          todoItems: [...state.todoItems, 
            action.item
          ]
        };
      case 'COMPLETE_ITEM':
        return markItemStateChange(true, action.id, state);
      case 'UNDO_COMPLETE_ITEM':
        return markItemStateChange(false, action.id, state);
      case 'TODO_ITEMS':
        return {
          ...state,
          todoItems: action.todoItems
        }
      default:
        throw new Error('Unexpected action');
    }
  };
  
```
ToDo Provider
```
import React from 'react';

export const ToDoContext = React.createContext({});
export const TodoProvider = ToDoContext.Provider;
```

Now adding everything together will look like below, we will passing store to the provider we have created.

```
const App = () => {

  const store = useReducer(todoReducer, initialState);
  return (
    <div className="App">
    <TodoProvider value={store}> 
      <ToDoHome />
    </TodoProvider>
    </div>
  );
}
```

Looking at reducer you might have noticed we will be dealing with 3 operations in this app.


1. Fetch todo items

This call happen only at once when the application is loaded, it will make API call and set the data in the store.
2. Add todo item

Whenever a new item is added, it will make an API call, on its success data will be stored in the store.

3. Complete/undo complete todo item

Whenever any existing item is marked as complete or not complete, it will call API and set the item in store.

The common structure of components is as follows.

Components use hooks for logic and state management. Any action in the component will trigger method in hook and based on logic defined it will call an API and update state or do some other action in the app.

Here is an example of todo item fetching hook. the [useEffect](https://reactjs.org/docs/hooks-effect.html) hook is used here to make API call and it dispatches the action to update todo items. "useEffect" is kind of equivalent to withPropsOnChange HoC from recompose in addition it also has behavior of componentDidMount if no prop name is passed. 


```
import { useEffect } from "react";
import { fetchTodoItems } from '../api/fetchToDoItems';
import { useToDoContext } from "./useTodoContext";
import {useCancellablePromise} from '../hooks/useCancellablePromise';

export const useToDoList = () => {
    const { state, dispatch } = useToDoContext();
    const { cancellablePromise } = useCancellablePromise();

    useEffect(() => {
            const fetchItems = async () => {
                const items = await cancellablePromise(fetchTodoItems());
                dispatch({
                        type: 'TODO_ITEMS',
                        todoItems: items
                });
                 
            };
    
            fetchItems();
        
    }, []);
    const { todoItems } = state;
    const openToDoItems = todoItems.filter(t => !t.isComplete);
    const completeToDoItems = todoItems.filter(t => t.isComplete);

    return {
        todoItems,
        openToDoItems,
        completeToDoItems
    };
}
```

Because of all this logic moved to "useToDoList" hook, component looks clear and focuses on presentation aspect. It feels like hooks are endorsing to make it more functional. Recompose is also trying to solve same problem, but the nested component tree makes it harder to understand and troubleshoot code.

```
const ToDoHome = () => {
    const { todoItems, openToDoItems, completeToDoItems } = useToDoList();
    

    return (
        <Container>
            <AddToDo />
            <TodoContainer>
                <Tabs defaultActiveKey="1" size={"large"}>
                    <TabPane tab={
                        <Badge count={openToDoItems.length} overflowCount={99}><TabTitle>Open</TabTitle></Badge>
                    } key="1">
                        <ToDoItems todoItems={openToDoItems} />

                    </TabPane>
                    <TabPane tab={<Badge count={completeToDoItems.length && <CompletedItemBadge>{completeToDoItems.length}</CompletedItemBadge>} overflowCount={99}>
                        <TabTitle>Completed</TabTitle></Badge>} key="2">
                        <ToDoItems todoItems={completeToDoItems} />

                    </TabPane>
                    <TabPane tab={<Badge count={todoItems.length && <AllItemsBadge>{todoItems.length}</AllItemsBadge>} overflowCount={99}><TabTitle>All</TabTitle></Badge>} key="3">
                        <ToDoItems todoItems={todoItems} />
                    </TabPane>
                </Tabs>

            </TodoContainer>
        </Container>
    );
}

export default ToDoHome;

```


##In conclusion:

Overall it's bit different than conventional HoC implementation we are used to write using recompose library. I feel its cleaner than recompose implementation. 

Application Demo:
[https://ashokdudhade.github.io/todo-with-hooks/](https://ashokdudhade.github.io/todo-with-hooks/)

Application code is available on github:
[https://github.com/ashokdudhade/todo-with-hooks](https://github.com/ashokdudhade/todo-with-hooks)
