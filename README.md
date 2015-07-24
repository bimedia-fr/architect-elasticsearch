architect-elasticsearch
=================

Expose elasticsearch as architect plugin. 

### Installation

```sh
npm install --save architect-elasticsearch
```

### Usage

Boot [Architect](https://github.com/c9/architect) :

```js
var path = require('path');
var architect = require("architect");

var config = architect.loadConfig(path.join(__dirname, "config.js"));

architect.createApp(config, function (err, app) {
    if (err) {
        throw err;
    }
    console.log("app ready");
});
```

Configure Architect with `config.js` to access the local Elasticsearch service:

```js
module.exports = [{
    packagePath: "architect-elasticsearch",
    settings: {
        default: {
            hosts: ['localhost:9200']
        }
    }
}, './services'];
```