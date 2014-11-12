'use strict';

var Immutable = require('immutable');

var mapPatch = function(map, patches) {
  return map.withMutations(function(updateMap) {
    patches.map(function(patch){
      var pathArray = patch.get('path').split('/').slice(1);
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

var sequencePatch = function (sequence, patches) {
  return sequence.withMutations(function (updateSeq) {
    patches.map(function(patch){
      var pathArray = patch.get('path').split('/').slice(1).map(toInt);
      var op = patch.get('op');

      if(op === 'add' || op === 'replace'){
        updateSeq.setIn(pathArray, patch.get('value'));
      }
      else if(op === 'remove'){
        updateSeq.removeIn(pathArray)
      }
    });
  });
};

var toInt = function(n) {
  return parseInt(n);
};

module.exports = function(immutableObject, patches){
  if(patches.count() === 0){ return immutableObject; }

  if(Immutable.Iterable.isKeyed(immutableObject)){
    return mapPatch(immutableObject, patches);
  }
  else{
    return sequencePatch(immutableObject, patches);
  }
};