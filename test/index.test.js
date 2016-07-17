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
var NULL_RULE = [[ null, {} ]];

describe('[index]', function() {
    
    describe('#parse', function() {
        it('parses an editorconfig file', function() {
            var obj = ec.parse(FILE);
            
            expect(obj).to.be.an('object')
                .and.to.have.all.keys(KEYS);
        });
        
        it('can parse an empty string to empty object', function() {
            var obj = ec.parse('');
            expect(obj).to.deep.equal({});
        });
    });
    
    describe('#parseRaw', function() {
        it('parses an editorconfig file into an array', function() {
            var arr = ec.parseRaw(FILE);
            
            expect(arr).to.be.an('array')
                .and.to.have.lengthOf(3);
        });
        
        it('parses an empty string into an array with an empty null rule', function() {
            var arr = ec.parseRaw('');
            expect(arr).to.deep.equal(NULL_RULE);
        });
    });
    
    describe('#serialize', function() {
        it('seralizes an object to an editorconfig string', function() {
            var str = ec.serialize(SAMPLE);
            
            expect(str).to.be.a('string').and.to.equal(OUT);
        });
        
        it('serializes an empty object', function() {
            var str = ec.serialize({});
            expect(str).to.equal('');
        });
    });
    
    describe('#serializeRaw', function() {
        it('serializes an array-based config into an editorconfir string', function() {
            var str = ec.serializeRaw(RAW);
            expect(str).to.be.a('string').and.to.equal(OUT);
        });
        
        it('serializes a null rule array into an empty string', function() {
            var str = ec.serializeRaw(NULL_RULE);
            expect(str).to.be.a('string').and.to.equal('');
        });
    });
});
