# editorconfig parser

Parse and serialize [.editorconfig](http://editorconfig.org/) files.

## Install

```bash
npm install editorconfig-parser
```

## Use

The following fuctions are available for general use:

* **`parse({String} str)`** → `{Object}`: parse an editorconfig file to an object.
* **`serialize({Object} obj)`** → `{String}`: serialize an object to an editorconfig file.

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

Example of a parsed editorconfig object:

```javascript
{
    root: 'true',
    '*': {
        indent_style: 'space',
        indent_size: '4',
        end_of_line: 'lf',
        charset: 'utf-8',
        insert_final_newline: 'true'
    },
    '{package.json,*.yml}': {
        indent_style: 'space',
        indent_size: '2',
        insert_final_newline: 'true'
    }
};
```

[Editorconfig](https://github.com/editorconfig/editorconfig-core-js) itself uses a modified parser that provides the content in an array instead of an object. Theoretically, this is safer, since it absolutely guaranteed order. Unless you are doing something crazy though, the object above will do just fine and will be much easier to manipulate than the array. However, this module will support parsing and serializing the array-based version as well, though the following methods:

* **`parseRaw({String} str)`** → `{Array}`: parse an editorconfig file to an array.
* **`serializeRaw({Array} arr)`** → `{String}`: serialize an array to an editorconfig file.

```javascript
var fs = require('fs');
var ec = require('editorconfig-parser');

// read a file from disk
var file = fs.readFileSync('.editorconfig', 'utf8');

var arr = ec.parseRaw(file);
// modify object
var str = ec.serializeRaw(arr);

// write the new file
fs.writeFileSync('.editorconfig', str);
```

Example of a parsed editorconfig array:

```javascript
[ 
    [ null, { root: 'true' } ],
    [ '*', {
        indent_style: 'space',
        indent_size: '4',
        end_of_line: 'lf',
        charset: 'utf-8',
        insert_final_newline: 'true'
    }],
    [ '{package.json,*.yml}', {
        indent_style: 'space',
        indent_size: '2',
        insert_final_newline: 'true'
    }]
]
```
