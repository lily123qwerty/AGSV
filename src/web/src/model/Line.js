import Shape from './Shape';

export default class Line extends Shape {
  constructor(dot1, dot2) {
    super('l');
    this._ends = [dot1, dot2];
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

  get desc() {
    if (this.ends[0].desc && this.ends[1].desc) {
      return this.ends[0].desc + this.ends[1].desc;
    } else {
      return null;
    }
  }

  toJSON() {
    let json = super.toJSON();
    json.dk1 = this.ends[0].key;
    json.dk2 = this.ends[1].key;
    return json;
  }
}
