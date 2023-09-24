export default class Style {
  constructor({ visible, size, color }) {
    this._visible = visible !== undefined ? visible : true;
    this._size = size !== undefined ? size : 5;
    this._color = color !== undefined ? color : 'black';
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

  toJSON() {
    return {
      visible: this.visible,
      size: this.size,
      color: this.color,
    };
  }

  static fromJSON(json) {
    if (json) {
      let obj = new Style(json);
      return obj;
    }
  }
}
