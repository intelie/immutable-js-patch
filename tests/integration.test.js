'use strict';

var assert = require('assert');
var Immutable = require('immutable');
var JSC = require('jscheck');
var diff = require('immutablediff');
var patch = require('../src/patch');


describe('replacing root value', function() {

  it('should replace with 0', function() {
    assert.strictEqual(
      patch(Immutable.Map(), Immutable.fromJS([
        {op:'replace', path: '/', value: 0}
      ])),
      0);

  });
});

describe('Map patch', function() {
  var failure = null;

  before(function(){
    JSC.on_report(function(report){
      console.log(report);
    });

    JSC.on_fail(function(jsc_failure){
      failure = jsc_failure;
    });
  });

  afterEach(function () {
    if(failure){
      console.error(failure);
      throw failure;
    }
  });

  it('patches diff between two objects', function () {
    JSC.test(
      'patches diff between two maps',
      function(veredict, obj1, obj2){
        var map1 = Immutable.fromJS(obj1);
        var map2 = Immutable.fromJS(obj2);

        var diffResult = diff(map1, map2);

        var patched = patch(map1, diffResult);

        var equal = Immutable.is(patched, map2);

        return veredict(equal);
      },
      [
        JSC.object(5),
        JSC.object(7)
      ],
      function(obj1, obj2){
        for(var key in obj1){
          if(obj1[key] === undefined){ return false; }
        }
        for(var key in obj2){
          if(obj2[key] === undefined){ return false; }
        }

        return 'ok';
      }
    );

    JSC.test(
      'patches diff between two lists',
      function(veredict, array1, array2){
        var list1 = Immutable.fromJS(array1);
        var list2 = Immutable.fromJS(array2);

        var diffResult = diff(list1, list2);

        var patched = patch(list1, diffResult);

        var equal = Immutable.is(patched, list2);

        return veredict(equal);
      },
      [
        JSC.array(10),
        JSC.array(15)
      ],
      function(array1, array2){
        for(var i = 0; i < array1.length; i++){
          if(array1[i] === undefined){ return false; }
        }
        for(var i = 0; i < array2.length; i++){
          if(array2[i] === undefined){ return false; }
        }
        return 'ok';
      }
    );

    JSC.test(
      'patches diff between empty list and existing list',
      function(veredict, array1){
        var list1 = Immutable.List();
        var list2 = Immutable.fromJS(array1);

        var diffResult = diff(list1, list2);

        var patched = patch(list1, diffResult);

        var equal = Immutable.is(patched, list2);

        return veredict(equal);
      },
      [
        JSC.array(10)
      ],
      function(array1){
        for(var i = 0; i < array1.length; i++){
          if(array1[i] === undefined){ return false; }
          if(typeof(array1[i]) === "object"){
            for(var key in array1[i]){
              if(array1[i][key] == null){ return false; }
            }
          }
        }
        return 'ok';
      }
    );

    JSC.test(
      'patches diff between empty map and existing map',
      function(veredict, obj){
        var map1 = Immutable.Map();
        var map2 = Immutable.fromJS(obj);

        var diffResult = diff(map1, map2);

        var patched = patch(map1, diffResult);

        var equal = Immutable.is(patched, map2);

        return veredict(equal);
      },
      [
        JSC.object(10)
      ],
      function(obj){
        for(var key in obj){
          if(obj[key] === undefined){ return false; }
        }
        return 'ok';
      }
    );
  });
});
