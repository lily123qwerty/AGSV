import Shape from './Shape';
import { rotate } from './helper';

export default class Angle extends Shape {
  constructor(dot, line1, line2) {
    super('a');
    this._vertex = dot;
    this._sides = [line1, line2];
    this.style.visible = false;
    this.style.size = 15;
  }

  get vertex() {
    return this._vertex;
  }

  get sides() {
    return this._sides;
  }

  get label() {
    return this.vertex.label;
  }

  get radian() {
    let r = Math.abs(
      this.sides[0].radian(this.vertex) - this.sides[1].radian(this.vertex)
    );
    if (r > Math.PI) {
      r = 2 * Math.PI - r;
    }

    return r;
  }

  set radian(val) {
    let r = val - this.radian;
    let r1 = this.sides[0].radian(this.vertex);
    let r2 = this.sides[1].radian(this.vertex);
    let end =
      this.vertex == this.sides[0].ends[0]
        ? this.sides[0].ends[1]
        : this.sides[0].ends[0];
    let changeEnd;
    //check which side is sides[0] on
    if (Math.abs(r1 - r2) > Math.PI) {
      if (r1 > r2) {
        changeEnd = rotate(end.x - this.vertex.x, end.y - this.vertex.y, r, -1);
      } else {
        changeEnd = rotate(end.x - this.vertex.x, end.y - this.vertex.y, r, 1);
      }
    } else {
      if (r1 > r2) {
        changeEnd = rotate(end.x - this.vertex.x, end.y - this.vertex.y, r, 1);
      } else {
        changeEnd = rotate(end.x - this.vertex.x, end.y - this.vertex.y, r, -1);
      }
    }

    end.x = changeEnd.x + this.vertex.x;
    end.y = changeEnd.y + this.vertex.y;
  }

  toJSON() {
    let json = super.toJSON();
    json.dk = this.vertex.key;
    json.lk1 = this.sides[0].key;
    json.lk2 = this.sides[1].key;

    return json;
  }
}
