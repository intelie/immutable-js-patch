'use strict';

var Immutable = require('immutable');

var mapPatch = function(map, patches) {
  if(patches.count() === 0){ return map; }
};


module.exports = function(immutableObject, patches){
  return mapPatch(immutableObject, patches);
};