export default class Category {
  constructor(key, name, icon) {
    this._key = key;
    this._name = name;
    this._icon = icon;
  }

  get key() {
    return this._key;
  }

  get name() {
    return this._name;
  }

  get icon() {
    return this._icon;
  }
}
