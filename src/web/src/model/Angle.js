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

  get desc() {
    return this.vertex.desc;
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

  //TODO: get the line on the right (the second line clockwise)
  rightLine() {
    let r1 = this.sideAngle(0);
    let r2 = this.sideAngle(1);
    let r;
    if ((r1 >= 0 && r2 >= 0) || (r1 <= 0 && r2 <= 0)) {
      if (r1 > r2) {
        r = 1;
      } else {
        r = 0;
      }
    } else {
      if (Math.abs(r1) + Math.abs(r2) >= Math.PI) {
        if (r1 < 0) {
          r = 1;
        } else {
          r = 0;
        }
      } else {
        if (r1 < 0) {
          r = 0;
        } else {
          r = 1;
        }
      }
    }
  }

  get radian() {
    let r = this.sideAngle(0) - this.sideAngle(1);
    r = Math.abs(r);
    if (r > Math.PI) {
      r = 2 * Math.PI - r;
    }
    return r;
  }

  set radian(val) {
    let r1 = this.sideAngle(0);
    let r2 = this.sideAngle(1);
    let r = val - this.radian;
    let rr1;

    if ((r1 >= 0 && r2 >= 0) || (r1 <= 0 && r2 <= 0)) {
      if (r1 > r2) {
        rr1 = true;
      } else {
        rr1 = false;
      }
    } else {
      if (Math.abs(r1) + Math.abs(r2) >= Math.PI) {
        if (r1 < 0) {
          rr1 = true;
        } else {
          rr1 = false;
        }
      } else {
        if (r1 < 0) {
          rr1 = false;
        } else {
          rr1 = true;
        }
      }
    }

    console.log(r1, r2);
    if (rr1) {
      if (this.sides[0].ends[0] == this.vertex) {
        const x = this.sides[0].ends[1].x - this.vertex.x;
        const y = this.sides[0].ends[1].y - this.vertex.y;
        let n = rotate(x, y, r, 1);
        this.sides[0].ends[1].x = n.x + this.vertex.x;
        this.sides[0].ends[1].y = n.y + this.vertex.y;
      } else {
        const x = this.sides[0].ends[0].x - this.vertex.x;
        const y = this.sides[0].ends[0].y - this.vertex.y;
        let n = rotate(x, y, r, 1);
        this.sides[0].ends[0].x = n.x + this.vertex.x;
        this.sides[0].ends[0].y = n.y + this.vertex.y;
      }
    } else {
      if (this.sides[1].ends[0] == this.vertex) {
        const x = this.sides[1].ends[1].x - this.vertex.x;
        const y = this.sides[1].ends[1].y - this.vertex.y;
        let n = rotate(x, y, r, 1);
        this.sides[1].ends[1].x = n.x + this.vertex.x;
        this.sides[1].ends[1].y = n.y + this.vertex.y;
      } else {
        const x = this.sides[1].ends[0].x - this.vertex.x;
        const y = this.sides[1].ends[0].y - this.vertex.y;
        let n = rotate(x, y, r, 1);
        this.sides[1].ends[0].x = n.x + this.vertex.x;
        this.sides[1].ends[0].y = n.y + this.vertex.y;
      }
    }
  }

  toJSON() {
    let json = super.toJSON();
    json.dk = this.vertex.key;
    json.lk1 = this.sides[0].key;
    json.lk2 = this.sides[1].key;

    return json;
  }
}
