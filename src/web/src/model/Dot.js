import Shape from './Shape';
import Style from './Style';

export default class Dot extends Shape {
  constructor(x, y, key, style) {
    super(key, style);
    this._x = x || 0;
    this._y = y || 0;
    this._label = null;
    if (!style) {
      this.style.visible = false;
      this.style.size = 4;
    }
  }

  get x() {
    return this._x;
  }

  set x(val) {
    this._x = val;
  }

  get y() {
    return this._y;
  }

  set y(val) {
    this._y = val;
  }

  get label() {
    return this._label;
  }

  set label(val) {
    this._label = val;
  }

  toJSON() {
    let json = super.toJSON();
    json.x = this.x;
    json.y = this.y;
    json.label = this.label;
    return json;
  }

  static fromJSON(json) {
    let obj = new Dot(json.x, json.y, json.key, Style.fromJSON(json.style));
    obj.label = json.label;
    return obj;
  }
}
