'use strict';

var Immutable = require('immutable');

var mapPatch = function(map, patches) {
  if(patches.count() === 0){ return map; }

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


module.exports = function(immutableObject, patches){
  return mapPatch(immutableObject, patches);
};