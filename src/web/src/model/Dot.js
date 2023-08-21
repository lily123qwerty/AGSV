import Shape from './Shape';

export default class Dot extends Shape {
  constructor(x, y) {
    super('d');
    this._x = x || 0;
    this._y = y || 0;
    this._label = null;
    this.style.visible = false;
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
    return json;
  }
}
