---
title: Typescript react app with yarn workspaces
date: "2018-10-09T02:13:55.325Z"
layout: post
draft: false
path: "/posts/typescript-react-app-with-yarn-worspaces/"
category: "React"
tags:
  - "React"
  - "Web Development"
description: "There are so many posts available for creating react app with yarn workspaces, but I have not came across any article with typescript."
---


Prerequisites:
* Nodejs
* yarn
* create-react-app


There are so many posts available for creating react app with yarn workspaces, but I have not came across any article with typescript.

To create a sample app we will use ```create-react-app``` utility.

```
create-react-app typescript-react-yarn-worspaces --scripts-version=react-scripts-ts

cd typescript-react-yarn-worspaces
```


Eject app to unpack all configuration files into our application. This is required to include yarn workspaces directory in typescript configurations.

```
yarn eject
```

It will display a message "Are you sure you want to eject? This action is permanent." Press 'y' to confirm. It should unpack configuration files.

``
### Why yarn workspaces?

Multiple reusable packages can be adding in single repository which can depend on each other with single yarn lock file at root directory. This also has benefit of always referring to latest package source code.


### Code changes

Open new 'typescript-react-yarn-worspaces' directory in your favorite IDE.

Create a directory for packages at root level (```typescript-react-yarn-worspaces\packages```).

Open package.json file and add worspaces details.

```
"workspaces": ["packages/*"]
```


Modify webpack configuration to include "packages" directory to include for build and watch.

Add packagesSrc in paths.js file. (```typescript-react-yarn-worspaces/config/paths.js```)

![packages source entry](./paths-01.png)


Modify webpack.config.dev.js to include packages directory.(```typescript-react-yarn-worspaces/config/webpack.config.dev.js```)

![dev 01](./dev-01.png)


![dev 02](./dev-02.png)


![dev 03](./dev-03.png)


![dev 04](./dev-04.png)




Modify webpack.config.prod.js to include packages directory.(```typescript-react-yarn-worspaces/config/webpack.config.prod.js```)

![prod 01](./prod-01.png)
![prod 02](./prod-02.png)
![prod 03](./prod-03.png)



Now let's create a reusable ```Header``` component for the application. Create a 'header' directory inside packages(```typescript-react-yarn-worspaces\packages\header```) and add below files.

Add package.json file(```typescript-react-yarn-worspaces\packages\header\package.json```).

```
{
    "name": "@my-app/header",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "react": "^16.5.2",
        "react-dom": "^16.5.2"
    },
    "devDependencies": {
        "@types/node": "^10.11.4",
        "@types/react": "^16.4.16",
        "@types/react-dom": "^16.0.8",
        "typescript": "^3.1.1"
    }
}
```
Add index.tsx file(```typescript-react-yarn-worspaces\packages\header\index.tsx```).

```
import * as React from 'react';

export class Header extends React.Component {
  public render() {
    return (
        <header className="App-header">
          <h1 className="App-title">Header from packages</h1>
        </header>
    );
  }
}
```


Modify root package json to add header package dependency along with App.tsx file.

package.json dependency

![package-json](./package-json.png)

App.tsx

```
import { Header } from '@my-app/header';
import * as React from 'react';
import './App.css';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Header/>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

To start app do as below.

```
yarn install
yarn start
```

Code is available at [github](https://github.com/ashokdudhade/typescript-react-yarn-worspaces)