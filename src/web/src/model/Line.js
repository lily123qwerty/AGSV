import Shape from './Shape';
import Style from './Style';

export default class Line extends Shape {
  constructor(dot1, dot2, key, style) {
    super(key, style);
    this._ends = [dot1, dot2];
    if (!style) {
      this.style.visible = false;
    }
    this._ends.forEach((dot) => dot.addRefCount());
  }

  delete() {
    this._ends.forEach((dot) => dot.delRefCount());
  }

  get ends() {
    return this._ends;
  }

  get length() {
    return Math.sqrt(
      (this.ends[0].y - this.ends[1].y) ** 2 +
        (this.ends[0].x - this.ends[1].x) ** 2
    );
  }

  //TODO: set length?

  get label() {
    if (this.ends[0].label && this.ends[1].label) {
      return this.ends[0].label + this.ends[1].label;
    } else {
      return null;
    }
  }

  radian(dot) {
    let end;
    if (dot == this.ends[0]) {
      end = this.ends[1];
    } else if (dot == this.ends[1]) {
      end = this.ends[0];
    } else {
      console.log('dot not in the line');
      return;
    }

    let x = end.x - dot.x;
    let y = end.y - dot.y;
    let r;
    if (x == 0) {
      if (y > 0) {
        r = Math.PI / 2;
      } else {
        r = (Math.PI / 2) * 3;
      }
    } else if (y == 0) {
      if (x > 0) {
        r = 0;
      } else {
        r = Math.PI;
      }
    } else {
      r = Math.atan(y / x);
      if (x < 0 && y < 0) {
        r = r + Math.PI;
      } else if (x < 0 && y > 0) {
        r = r + Math.PI;
      } else if (y < 0 && x > 0) {
        r = r + 2 * Math.PI;
      }
    }

    return r;
  }

  toJSON() {
    let json = super.toJSON();
    json.dk1 = this.ends[0].key;
    json.dk2 = this.ends[1].key;
    return json;
  }

  static fromJSON(json, dots) {
    let obj = new Line(
      dots[json.dk1],
      dots[json.dk2],
      json.key,
      Style.fromJSON(json.style)
    );
    return obj;
  }
}
