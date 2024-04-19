import Shape from './Shape';
import Style from './Style';
import Line from './Line';
import Dot from './Dot';

export default class Circle extends Shape {
  constructor(center, radius, semiCircle, diameter, key, style) {
    super(key, style);
    this._center = center;
    // r and d are lines
    this._radius = radius;
    // a line model for the diameter of semi-circle or for using the diameter to create other shape
    // semiCircle always draw from diameter.ends[0] to diameter.ends[1] clockwise
    this._diameter = diameter;
    this._semiCircle = semiCircle;

    if (!style) {
      this.style.visible = false;
      this.style.color = 'red';
    }
  }

  get center() {
    return this._center;
  }

  get radius() {
    return this._radius;
  }

  get semiCircle() {
    return this._semiCircle;
  }

  get diameter() {
    return this._diameter;
  }

  set diameter(d) {
    this._diameter = d;
  }

  get area() {
    if (this.semiCircle) {
      return (Math.PI * this.radius.length * this.radius.length) / 2;
    } else {
      return Math.PI * this.radius.length * this.radius.length;
    }
  }

  get label() {
    return this.center.label;
  }

  toJSON() {
    let json = super.toJSON();
    json.center = this.center.key;
    json.diameter = this_diameter == null ? null : this.diameter;
    json.radius = this.radius;
    json.semiCircle = this.semiCircle;
    return json;
  }

  static fromJSON(json, dots, lines, angles) {
    let obj = new Circle(
      dots[json.center],
      json.radius,
      json.semiCircle,
      lines[json.diameter],
      json.key,
      Style.fromJSON(json.style)
    );
    return obj;
  }
}
