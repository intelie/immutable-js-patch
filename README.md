Immutable Patch
====

Apply RFC 6902 style patches to Immutable.JS data structures, such as `Maps`, `Lists`, and `Sets`.

### Getting Started

You may get the module via npm:

```
npm install immutablepatch
```

And apply JSON patches to an immutable JSON object:

```js
var Immutable = require('immutable');
var patch = require('immutablepatch');

var list = Immutable.fromJS([1, 2, [3, 4]]);
var ops = Immutable.fromJS([
  {op: 'replace', path: '/2/1', value: 10}
]);

var result = patch(list, ops);
// var expected = Immutable.fromJS([1, 2, [3, 10]]);
```

You will probably need [`immutablediff`](https://github.com/intelie/immutable-js-diff) to generate diff operations.
