import Map from 'ol/Map'
import * as tilegrid from 'ol/tilegrid'
import {createXYZ} from 'ol/tilegrid'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZSource from 'ol/source/XYZ'
import ImageStyle from 'ol/style/Image'
import Icon from 'ol/style/Icon'
import Circle from 'ol/style/Circle'
import easing from 'ol/easing'
import {defaults as defaultsControl} from 'ol/control'

const q = tilegrid
const qq = Map.prototype.getView
const qqq = VectorLayer
const qqqq = tilegrid.createXYZ()
const qqqqq = new VectorSource()
const x = new XYZSource()

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

defaultsControl()

export {
  easing,
  Map,
  VectorLayer
}
