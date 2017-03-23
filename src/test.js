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
