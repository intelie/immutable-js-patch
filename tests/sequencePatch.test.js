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

  it('adds value among a list', function () {
    var list = Immutable.fromJS({a: [1, 2, 3, 4]})
    var ops = Immutable.fromJS([
      {op: 'add', path: '/a/1', value: 'x'}
    ]);

    var result = patch(list, ops);
    var expected = Immutable.fromJS({a: [1,'x',2,3,4]})

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

  it('adds value to end', function () {
    var list = Immutable.List([1, 2, 3]);
    var ops = Immutable.fromJS([
      {op: 'add', path: '/-', value: 4}
    ]);

    var result = patch(list, ops);
    var expected = Immutable.List([1,2,3,4]);
    assert.ok(Immutable.is(result, expected));
  });

  it('replaces old values', function () {
    var list = Immutable.List([1,2,3]);
    var ops = Immutable.fromJS([
      {op: 'replace', path: '/0', value: 10}
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

  describe('nested sequences', function() {
    it('adds missing value to nested seq', function () {
      var list = Immutable.fromJS([1, 2, 3, [4, 5]]);
      var ops = Immutable.fromJS([
        {op: 'add', path: '/3/2', value: 6}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1,2,3,[4,5,6]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('adds value to nested seq end', function () {
      var list = Immutable.fromJS([1, 2, 3, [4, 5]]);
      var ops = Immutable.fromJS([
        {op: 'add', path: '/3/-', value: 6}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1,2,3,[4,5,6]]);
      assert.ok(Immutable.is(result, expected));
    });

    it('adds values in empty list to nested seq', function () {
      var list = Immutable.List();
      var ops = Immutable.fromJS([
        {op: 'add', path: '/0', value: 1},
        {op: 'add', path: '/1', value: 2},
        {op: 'add', path: '/2/0', value: 3}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1,2,[3]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('replaces old values to nested seq', function () {
      var list = Immutable.fromJS([1,2,[3, 4]]);
      var ops = Immutable.fromJS([
        {op: 'replace', path: '/2/1', value: 10}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1,2,[3,10]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('removes values to nested seq', function () {
      var list = Immutable.fromJS([1,2,3,[4, 5]]);
      var ops = Immutable.fromJS([
        {op: 'remove', path: '/3/1'}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1,2,3,[4]]);

      assert.ok(Immutable.is(result, expected));
    });
  });

  describe('nested maps', function() {
    it('adds missing value to nested map', function () {
      var list = Immutable.fromJS([1, 2, 3, [{a: 1}]]);
      var ops = Immutable.fromJS([
        {op: 'add', path: '/3/0/b', value: 10}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1, 2, 3, [{a: 1, b: 10}]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('adds values in empty list to nested map', function () {
      var list = Immutable.List();
      var ops = Immutable.fromJS([
        {op: 'add', path: '/0', value: Immutable.fromJS({a: 1})},
        {op: 'add', path: '/1', value: Immutable.fromJS({a: 2})},
        {op: 'add', path: '/2/0', value: Immutable.fromJS({a: 3})}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([{a:1}, {a:2},[{a:3}]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('replaces old values to nested map', function () {
      var list = Immutable.fromJS([1, 2, 3, [{a: 1}]]);
      var ops = Immutable.fromJS([
        {op: 'add', path: '/3/0/a', value: 10}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1, 2, 3, [{a: 10}]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('removes values from nested map', function () {
      var list = Immutable.fromJS([1, 2, 3, [{a: 1, b: 10}]]);
      var ops = Immutable.fromJS([
        {op: 'remove', path: '/3/0/b'}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1, 2, 3, [{a: 1}]]);

      assert.ok(Immutable.is(result, expected));
    });

    it('patch nested maps in empty lists', function() {
      var list = Immutable.List();
      var ops = Immutable.fromJS([
        {op: 'add', path: '/0', value: 1},
        {op: 'add', path: '/1', value: 2},
        {op: 'add', path: '/2', value: 3},
        {op: 'add', path: '/3/0/a', value: 1},
        {op: 'add', path: '/3/0/b', value: 10}
      ]);

      var result = patch(list, ops);
      var expected = Immutable.fromJS([1, 2, 3, [{a: 1, b: 10}]]);

      assert.ok(Immutable.is(result, expected));
    });

    describe('nested maps with escaped paths', function() {
      it('add unescaped path', function() {
        var map = Immutable.fromJS([{a: 1}, {'b': 2}]);
        var ops = Immutable.fromJS([
          {op: 'add', path: '/2/prop~1prop', value: 3}
        ]);

        var expected = Immutable.fromJS([{a: 1}, {'b': 2}, {'prop/prop': 3}]);
        var result = patch(map, ops);

        assert.ok(Immutable.is(result, expected));
      });

      it('replaces unescaped path', function() {
        var map = Immutable.fromJS([{a: 1}, {'prop/prop': 2}]);
        var ops = Immutable.fromJS([
          {op: 'replace', path: '/1/prop~1prop', value: 10}
        ]);

        var expected = Immutable.fromJS([{a: 1}, {'prop/prop': 10}]);
        var result = patch(map, ops);

        assert.ok(Immutable.is(result, expected));
      });

      it('removes unescaped path', function() {
        var map = Immutable.fromJS([{a: 1}, {b: 2, 'prop/prop': 2}]);
        var ops = Immutable.fromJS([
          {op: 'remove', path: '/1/prop~1prop'}
        ]);

        var expected = Immutable.fromJS([{a: 1}, {b: 2}]);
        var result = patch(map, ops);

        assert.ok(Immutable.is(result, expected));
      });
    });
  });
});