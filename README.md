Application name
================

Compilation
-----------

First of all, you need to install the dependencies. You can use `npm` or `yarn`:
```
$ npm install
$ yarn install
```

In order to build this cordova project, the best is to use `gulp`:
* **`node_modules/.bin/gulp build`** will build the assets with webpack and call cordova to prepare the project.

Once built, you can run the cordova server and access the application on [localhost:8000](http://localhost:8000/).
```
$ node_modules/.bin/cordova serve
```
