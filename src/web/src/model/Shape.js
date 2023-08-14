import Style from './Style';
export default class Shape {
  constructor(prefix) {
    this._key = Shape._makeKey(prefix);
    this._style = new Style({});
  }

  static {
    this._key_seq = 0;
  }

  static _makeKey(prefix) {
    prefix = prefix || 'k';
    var key = prefix + this._key_seq;
    this._key_seq++;
    return key;
  }

  get key() {
    return this._key;
  }

  get style() {
    return this._style;
  }

  set style(val) {
    this._style = val;
  }

  toJSON() {
    let json = {
      key: this.key,
    };
    if (this.style) {
      json.style = this.style.toJSON();
    }
    return json;
  }

  static fromJSON(json) {
    // let obj = new Shape();
    // obj.visible = json.visible;
    // obj.size = json.size;
    // obj.color = json.color;
    // obj.label = json.label;
    // return obj;
  }
}
