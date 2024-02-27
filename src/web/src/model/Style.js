export default class Style {
  constructor({ visible, size, color, round }) {
    this._visible = visible !== undefined ? visible : true;
    this._size = size !== undefined ? size : 5;
    this._color = color !== undefined ? color : 'black';
    this._round = round !== undefined ? round : 1;
  }

  get visible() {
    return this._visible;
  }

  set visible(val) {
    this._visible = val;
  }

  get size() {
    return this._size;
  }

  set size(val) {
    this._size = val;
  }

  get color() {
    return this._color;
  }

  set color(val) {
    this._color = val;
  }

  get round() {
    return this._round;
  }

  set round(val) {
    this._round = val;
  }

  toJSON() {
    return {
      visible: this.visible,
      size: this.size,
      color: this.color,
      round: this.round,
    };
  }

  static fromJSON(json) {
    if (json) {
      let obj = new Style(json);
      return obj;
    }
  }
}
