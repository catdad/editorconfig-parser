# editorconfig parser

Parse and serialize [.editorconfig]() files.

## Install

```bash
npm install editorconfig-parser
```

## Use

The following fuctions are available for general use:

* **parse({String} str)** → {Object}: parse an editorconfig file to an object.
* **serialize({Object} obj)** → {String}: serialize an object to an editorconfig file.

```javascript
var fs = require('fs');
var ec = require('editorconfig-parser');

// read a file from disk
var file = fs.readFileSync('.editorconfig', 'utf8');

var obj = ec.parse(file);
// modify object
var str = ec.serialize(obj);

// write the new file
fs.writeFileSync('.editorconfig', str);
```
