'use strict';

var Immutable = require('immutable');
var path = require('./path');

var mapPatch = function(map, patches) {
  return map.withMutations(function(updateMap) {
    patches.map(function(patch){
      var pathArray = patch.get('path').split('/').slice(1).map(path.unescape);
      var op = patch.get('op');

      if(op === 'add' || op === 'replace'){
        updateMap.setIn(pathArray, patch.get('value'));
      }
      else if(op === 'remove'){
        updateMap.removeIn(pathArray)
      }
    });
  });
};

/**
 * TODO: use `withMutations` when this gets fixed:
 * https://github.com/facebook/immutable-js/issues/196
 */
var sequencePatch = function (sequence, patches) {
  var updateSeq = sequence;
  patches.map(function(patch){
    var pathArray = patch.get('path').split('/').slice(1).map(parsePath);
    var op = patch.get('op');

    if(op === 'add'){
      var parentPath = pathArray.slice(0, -1);
      var parent = updateSeq.getIn(parentPath);
      if(Immutable.Iterable.isIndexed(parent)){
        updateSeq = updateSeq.updateIn(parentPath, function(list){
          return list.splice(pathArray[pathArray.length-1], 0, patch.get('value'));
        });
      }
      else{
        updateSeq = updateSeq.setIn(pathArray, patch.get('value'));
      }
    }
    else if(op === 'replace'){
      updateSeq = updateSeq.setIn(pathArray, patch.get('value'));
    }
    else if(op === 'remove'){
      updateSeq = updateSeq.removeIn(pathArray)
    }
  });

  return updateSeq;
};

var primitivePatch = function (value, patches) {
  var op = patches.get(0).get('op');

  if(op === 'add' || op === 'replace'){
    return patches.get(0).get('value');
  }
  else if (op === 'remove'){
    return null;
  }
};

var tryParseInt = function(n) {
  var int = parseInt(n);
  return isNaN(int) ? n : int;
};

var parsePath = function(n){
  return tryParseInt(path.unescape(n));
};

module.exports = function(value, patches){
  if(patches.count() === 0){ return value; }

  if(Immutable.Iterable.isKeyed(value)){
    return mapPatch(value, patches);
  }
  else if(Immutable.Iterable.isIndexed(value)){
    return sequencePatch(value, patches);
  }
  else{
    return primitivePatch(value, patches);
  }
};