'use strict';

var Immutable = require('immutable');

var mapPatch = function(map, patches) {
  if(patches.count() === 0){ return map; }

  return map.withMutations(function(updateMap) {
    patches.map(function(patch){
      var pathArray = patch.get('path').split('/').slice(1);

      updateMap.setIn(pathArray, patch.get('value'));
    });
  });
};


module.exports = function(immutableObject, patches){
  return mapPatch(immutableObject, patches);
};