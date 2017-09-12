import Map from 'ol/map'
import tilegrid from 'ol/tilegrid'
import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'
import ImageStyle from 'ol/style/image'
import Icon from 'ol/style/icon'
import Circle from 'ol/style/circle'
import easing from 'ol/easing'
import control from 'ol/control'

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

const v = false
const vv = v instanceof ImageStyle
const Ctor = Icon

function func () {
  return Circle
}

const a = [ Circle, Icon ]

const b = {
  imageCtor: ImageStyle,
  circleCtor: Circle
}

control.defaults()

export {
  easing,
  Map,
  VectorLayer
}
