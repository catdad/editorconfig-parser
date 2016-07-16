/* jshint node: true */

var util = require('util');
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

    return ec.reduce(function(seed, arr) {
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
        // make sure `root` always goes first
        if (key === 'root') {
            // add a blank life after
            elems.unshift('');
            elems.unshift(util.format('%s = %s', key, val));
        } else if (typeof val === 'object') {
            elems.push(util.format('[%s]', key));
            elems.push(serialize(val));
        } else {
            elems.push(util.format('%s = %s', key, val));
        }
    });
    
    return elems.join('\n').trim() + '\n';
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
