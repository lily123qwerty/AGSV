import Graph from './Graph';

export default class History {
  constructor() {
    this._history = [new Graph().toJSON()];
    this._index = 0;
  }

  push(g) {
    if (this._index < this._history.length - 1) {
      this._history.splice(this._index + 1, this._history.length);
    }
    this._history.push(g.toJSON());
    this._index = this._history.length - 1;
  }

  moveBackward() {
    if (this._index > 0) {
      this._index--;
      return Graph.fromJSON(this._history[this._index]);
    }
  }

  moveForward() {
    if (this._index < this._history.length - 1) {
      this._index++;
      return Graph.fromJSON(this._history[this._index]);
    }
  }
}
