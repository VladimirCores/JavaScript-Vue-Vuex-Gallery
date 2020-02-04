# Vue-Gallery

> A Vue.js project

1. Install and run CouchDB: https://couchdb.apache.org/
2. Create database "application" in Fauxton and add "settings" document to it:
{
  "url": "https://api.vimeo.com/users",
  "imageAPI": "https://source.unsplash.com"
}
3. You have to have an access token from Vimeo Developers site: https://developer.vimeo.com/
And then add the token in the app settings (click gear in the left bottom corner)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
