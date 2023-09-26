import Style from './Style';
export default class Shape {
  constructor(key, style) {
    this._key = key;
    this._style = style || new Style({});
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
}
