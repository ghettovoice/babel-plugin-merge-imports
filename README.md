# babel-plugin-ol-to-openlayers

> Transform plugin for Babel to convert ES2015 imports of [ol](https://www.npmjs.com/package/ol) to require of [openlayers](https://www.npmjs.com/package/openlayers)

## Example

**Before**
```js
// Variables should contain original name from OpenLayers package
import Map from 'ol/map'
import tilegrid from 'ol/tilegrid'
import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'

const q = tilegrid
const qq = Map.prototype.getView
const qqq = VectorLayer
const qqqq = tilegrid.createXYZ()
const qqqqq = new VectorSource()

const map = new Map({
  layers: [
    new VectorLayer({
      source: new VectorSource()
    })
  ]
})
```

**After**
```js
var _ol_ = require('openlayers');

const q = _ol_.tilegrid;
const qq = _ol_.Map.prototype.getView;
const qqq = _ol_.layer.Vector;
const qqqq = _ol_.tilegrid.createXYZ();
const qqqqq = new _ol_.source.Vector();

const map = new _ol_.Map({
  layers: [new _ol_.layer.Vector({
    source: new _ol_.source.Vector()
  })]
});
```
