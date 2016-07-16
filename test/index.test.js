/* jshint node: true, mocha: true */

var fs = require('fs');
var path = require('path');

var expect = require('chai').expect;
var ec = require('../index.js');

var FILE = fs.readFileSync(
    path.resolve(__dirname, '../fixtures/editorconfig'),
    'utf8'
);
var KEYS = [
    'root', '*', '{package.json,*.yml}'
];

// hand-made sample data
var SAMPLE = {
    root: true,
    '*': { thing: 'stuff' },
    '*.json': { yellow: 'pineapples' }
};
var RAW = [
    [ null, { root: true }],
    [ '*', { thing: 'stuff' }],
    [ '*.json', { yellow: 'pineapples' }]
];
var OUT = 'root = true\n\n[*]\nthing = stuff\n\n[*.json]\nyellow = pineapples\n';


describe('[index]', function() {
    
    describe('#parse', function() {
        it('parses an editorconfig file', function() {
            var obj = ec.parse(FILE);
            
            expect(obj).to.be.an('object')
                .and.to.have.all.keys(KEYS);
        });
    });
    
    describe('#parseRaw', function() {
        it('parsed an editorconfig file into an array', function() {
            var arr = ec.parseRaw(FILE);
            
            expect(arr).to.be.an('array')
                .and.to.have.lengthOf(3);
        });
    });
    
    describe('#serialize', function() {
        it('seralizes an object to an editorconfig string', function() {
            var str = ec.serialize(SAMPLE);
            
            expect(str).to.be.a('string').and.to.equal(OUT);
        });
    });
    
    describe('#serializeRaw', function() {
        it('serializes an array-based config into an editorconfir string', function() {
            var str = ec.serializeRaw(RAW);
            expect(str).to.be.a('string').and.to.equal(OUT);
        });
    });
});
