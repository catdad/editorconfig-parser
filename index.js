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
            var newSeed = { root: arr[1].root };
            
            // Copy all existing values, to make sure
            // root is first in the object. Serialize
            // should take care of this, but we will
            // do it here for the object anyway.
            forEach(seed, function(val, key) {
                newSeed[key] = val;
            });
            
            seed = newSeed;
        } else if (arr[0] && arr[1]) {
            seed[arr[0]] = arr[1];
        }
        
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
            // add root first
            elems.unshift(util.format('%s = %s', key, val));
        } else if (typeof val === 'object') {
            // add the rule as a title, and serialize
            // the rest of the object
            elems.push(util.format('[%s]', key));
            elems.push(serialize(val));
        } else {
            // this is a key value pair, insert normally
            elems.push(util.format('%s = %s', key, val));
        }
    });
    
    // we could end up with multiple new lines at the
    // end due to recurssion, so we'll trim that, and
    // add a single new line
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
