import Style from './Style';
export default class Shape {
  constructor(prefix, key, style) {
    this._key = key || Shape._makeKey(prefix);
    this._style = style || new Style({});
  }

  static {
    this._key_seq = 0;
  }

  static get key_seq() {
    return this._key_seq;
  }

  static set key_seq(val) {
    this._key_seq = val;
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

  get label() {
    return null;
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

  static fromJSON(json) {}
}
