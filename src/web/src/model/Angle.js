import Shape from './Shape';
import { rotate } from './helper';
import Style from './Style';

export default class Angle extends Shape {
  constructor(dot, line1, line2, key, style) {
    super(key, style);
    this._vertex = dot;
    this._sides1 = [line1];
    this._sides2 = [line2];
    if (!style) {
      this.style.visible = false;
      this.style.size = 15;
    }
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

  //TODO: change all line in this._sides
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
      line1.radian(this.vertex) == this.sides1[0].radian(this.vertex) &&
      line2.radian(this.vertex) == this.sides2[0].radian(this.vertex)
    ) {
      this._sides1.push(line1);
      this._sides2.push(line2);
    } else if (
      line1.radian(this.vertex) == this.sides2[0].radian(this.vertex) &&
      line2.radian(this.vertex) == this.sides1[0].radian(this.vertex)
    ) {
      this._sides1.push(line2);
      this._sides2.push(line1);
    } else {
      console.log(0);
      return false;
    }
    console.log(1);
    return true;
  }

  //TODO: remember all key for line
  toJSON() {
    let json = super.toJSON();
    json.dk = this.vertex.key;
    json.lk1 = this.sides1[0].key;
    json.lk2 = this.sides2[0].key;

    return json;
  }

  static fromJSON(json, dots, lines) {
    let obj = new Angle(
      dots[json.dk],
      lines[json.lk1],
      lines[json.lk2],
      json.key,
      Style.fromJSON(json.style)
    );
    return obj;
  }
}
