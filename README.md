# babel-plugin-ol-to-openlayers

> Transform plugin for Babel to convert ES2015 imports of [ol](https://www.npmjs.com/package/ol) to require of [openlayers](https://www.npmjs.com/package/openlayers)

## Example

**Before**
```js
import Map from 'ol/map'
import View from 'ol/view'
import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'

const map = new Map({
  view: new View(),
  layers: [
    new VectorLayer({
      source: new VectorSource()
    })
  ]
})
```

**After**
```js
var _ol_ = require('openlayers')

const map = new _ol_.Map({
  view: new _ol_.View(),
  layers: [
    new _ol_.layer.Vector({
      source: new _ol_.source.Vector()
    })
  ]
})
```
