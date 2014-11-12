'use strict';

var Immutable = require('immutable');
var assert = require('assert');
var patch = require('../src/patch');

describe('Indexed sequence patch', function() {
  it('returns same sequence when ops are empty', function () {
    var list = Immutable.List([1, 2, 3]);
    var ops = Immutable.List();

    var result = patch(list, ops);

    assert.ok(Immutable.is(list, result));
  });

  it('adds missing value', function () {
    var list = Immutable.List([1, 2, 3]);
    var ops = Immutable.fromJS([
      {op: 'add', path: '/3', value: 4}
    ]);

    var result = patch(list, ops);
    var expected = Immutable.List([1,2,3,4]);

    assert.ok(Immutable.is(result, expected));
  });

  it('adds values in empty list', function () {
    var list = Immutable.List();
    var ops = Immutable.fromJS([
      {op: 'add', path: '/0', value: 1},
      {op: 'add', path: '/1', value: 2},
      {op: 'add', path: '/2', value: 3}
    ]);

    var result = patch(list, ops);
    var expected = Immutable.List([1,2,3]);

    assert.ok(Immutable.is(result, expected));
  });

  it('replaces old values', function () {
    var list = Immutable.List([1,2,3]);
    var ops = Immutable.fromJS([
      {op: 'replace', path: '/0', value: 10},
    ]);

    var result = patch(list, ops);
    var expected = Immutable.List([10,2,3]);

    assert.ok(Immutable.is(result, expected));
  });

  it('removes values', function () {
    var list = Immutable.List([1,2,3,4]);
    var ops = Immutable.fromJS([
      {op: 'remove', path: '/0'}
    ]);

    var result = patch(list, ops);
    var expected = Immutable.List([2,3,4]);

    //TODO: investigate why Immutable.is does not work here.
    //assert.ok(Immutable.is(result, expected);
    assert.deepEqual(result.toJS(), expected.toJS())
  });
});