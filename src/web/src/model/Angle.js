import Shape from './Shape';

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

  // this is the angle from x positive anti-clockwise to side
  sideAngle(side) {
    let r;
    let x1 = this.vertex.x;
    let y1 = this.vertex.y;
    let x2 = this.sides[side].ends[0].x;
    let y2 = this.sides[side].ends[0].y;
    if (x1 == x2 && y1 == y2) {
      x2 = this.sides[side].ends[1].x;
      y2 = this.sides[side].ends[1].y;
    }

    if (x2 == x1) {
      if (y2 > y1) {
        r = Math.PI / 2;
      } else {
        r = -Math.PI / 2;
      }
    } else {
      r = Math.atan((y2 - y1) / (x2 - x1));
      if (x2 < x1) {
        r = r - Math.PI;
      }
    }
    return r;
  }

  get radian() {
    let r = this.sideAngle(0) - this.sideAngle(1);
    r = Math.abs(r);
    if (r > Math.PI) {
      r = 2 * Math.PI - r;
    }
    return r;
  }

  toJSON() {
    let json = super.toJSON();
    json.dk = this.vertex.key;
    json.lk1 = this.sides[0].key;
    json.lk2 = this.sides[1].key;

    return json;
  }
}
