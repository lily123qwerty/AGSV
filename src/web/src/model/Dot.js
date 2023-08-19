import Shape from './Shape';

export default class Dot extends Shape {
  constructor(x, y) {
    super('d');
    this._x = x || 0;
    this._y = y || 0;
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

  get desc() {
    return this.style.label;
  }

  toJSON() {
    let json = super.toJSON();
    json.x = this.x;
    json.y = this.y;
    return json;
  }
}
