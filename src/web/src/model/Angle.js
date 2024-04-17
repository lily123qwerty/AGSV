import Shape from './Shape';
import { rotate } from './helper';
import Style from './Style';

export default class Angle extends Shape {
  constructor(dot, line1, line2, key, style) {
    super(key, style);
    this._vertex = dot;
    if (Array.isArray(line1)) {
      this._sides1 = line1;
    } else {
      this._sides1 = [line1];
    }

    if (Array.isArray(line2)) {
      this._sides2 = line2;
    } else {
      this._sides2 = [line2];
    }

    if (!style) {
      this.style.visible = false;
      this.style.size = 15;
    }

    this._vertex.addRefCount();
    this._sides1.forEach((line) => line.addRefCount());
    this._sides2.forEach((line) => line.addRefCount());
  }

  delete() {
    this._vertex.delRefCount();
    this._sides1.forEach((line) => line.delRefCount());
    this._sides2.forEach((line) => line.delRefCount());
  }

  get vertex() {
    return this._vertex;
  }

  get sides1() {
    return this._sides1;
  }

  get sides2() {
    return this._sides2;
  }

  get label() {
    return this.vertex.label;
  }

  get radian() {
    let r = Math.abs(
      this._sides1[0].radian(this.vertex) - this._sides2[0].radian(this.vertex)
    );
    if (r > Math.PI) {
      r = 2 * Math.PI - r;
    }

    return r;
  }

  set radian(val) {
    let r = val - this.radian;
    let r1 = this.sides1[0].radian(this.vertex);
    let r2 = this.sides2[0].radian(this.vertex);
    let direction = -1;
    //check which side is sides1 on
    if (Math.abs(r1 - r2) > Math.PI) {
      if (r1 <= r2) {
        direction = 1;
      }
    } else {
      if (r1 > r2) {
        direction = 1;
      }
    }

    for (let i = 0; i < this.sides1.length; i++) {
      let end =
        this.vertex == this.sides1[i].ends[0]
          ? this.sides1[i].ends[1]
          : this.sides1[i].ends[0];
      let changeEnd = rotate(
        end.x - this.vertex.x,
        end.y - this.vertex.y,
        r,
        direction
      );
      end.x = changeEnd.x + this.vertex.x;
      end.y = changeEnd.y + this.vertex.y;
    }
  }

  addAngle(line1, line2) {
    if (
      Math.abs(line1.radian(this.vertex) - this.sides1[0].radian(this.vertex)) <
        0.01 &&
      Math.abs(line2.radian(this.vertex) - this.sides2[0].radian(this.vertex)) <
        0.01
    ) {
      this._sides1.push(line1);
      this._sides2.push(line2);
      line1.addRefCount();
      line2.addRefCount();
    } else if (
      Math.abs(line1.radian(this.vertex) - this.sides2[0].radian(this.vertex)) <
        0.01 &&
      Math.abs(
        line2.radian(this.vertex) == this.sides1[0].radian(this.vertex)
      ) < 0.01
    ) {
      this._sides1.push(line2);
      this._sides2.push(line1);
      line1.addRefCount();
      line2.addRefCount();
    } else {
      return false;
    }
    return true;
  }

  toJSON() {
    let json = super.toJSON();
    json.dk = this.vertex.key;
    json.sides1 = this.sides1.map((obj) => obj.key);
    json.sides2 = this.sides2.map((obj) => obj.key);

    return json;
  }

  static fromJSON(json, dots, lines) {
    let obj = new Angle(
      dots[json.dk],
      json.lk1 ? lines[json.lk1] : json.sides1.map((key) => lines[key]),
      json.lk2 ? lines[json.lk2] : json.sides2.map((key) => lines[key]),
      json.key,
      Style.fromJSON(json.style)
    );
    return obj;
  }
}
