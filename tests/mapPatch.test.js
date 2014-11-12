'use strict';

var Immutable = require('immutable');
var assert = require('assert');
var patch = require('../src/patch');

describe('Map patch', function () {
  it('returns same Map when ops are empty', function () {
    var map = Immutable.Map({a: 1, b:2});
    var ops = Immutable.List();

    var result = patch(map, ops);

    assert.ok(Immutable.is(map, result));
  });
});