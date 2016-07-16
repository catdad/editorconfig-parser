/* jshint node: true */

var ini = require('./third-party/ini.js');

function forEach(obj, func, ctx) {
    if (obj.forEach && typeof obj.forEach === 'function') {
        return obj.forEach(func, ctx);
    } else {
        Object.keys(obj).forEach(function(key) {
            func.call(ctx, obj[key], key, obj);
        });
    }
}

function ecToIni(ec) {
    if (!Array.isArray(ec)) {
        throw new Error('raw parameter must be an array');
    }
    
    ec.reduce(ec, function(seed, arr) {
        if (arr[0] === null && arr[1] && arr[1].root !== undefined) {
            return { root: arr[1].root };
        }
        
        seed[arr[0]] = arr[1];
        return seed;
    }, {});
}

function parse(str) {
    return ecToIni(ini.parseString(str));
}

function parseRaw(str) {
    return ini.parseString(str);
}

function serialize(obj) {
    var elems = [];
    
    forEach(obj, function(val, key) {
        if (key === 'root') {
            elems.unshift(key + ' = ' + val);
        } else if (typeof val === 'object') {
            elems.push(key);
            elems.push(serialize(val));
        }
    });
    
    return elems.join('\n');
}

function serializeRaw(arr) {
    return serialize(ecToIni(arr));
}

module.exports = {
    parse: parse,
    parseRaw: parseRaw,
    serialize: serialize,
    serializeRaw: serializeRaw
};

// iniparser
// this is the prefered format
var iniparser = {
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


// editorconfig
// this is the format parsed by the parser in editorconfig
var editorconfig = [ 
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
];
