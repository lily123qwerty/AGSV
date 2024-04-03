import Graph from './Graph';

export default class History {
  constructor(graph) {
    this._graph = graph || new Graph();
    this.reset();
  }

  reset() {
    this._history = [this._graph.toJSON()];
    this._index = 0;
  }

  get hasHistory() {
    return this._index > 0;
  }

  push() {
    if (this._index < this._history.length - 1) {
      this._history.splice(this._index + 1, this._history.length);
    }
    this._history.push(this._graph.toJSON());
    this._index = this._history.length - 1;
  }

  moveBackward() {
    if (this._index > 0) {
      this._index--;
      this._graph.fromJSON(this._history[this._index]);
    }
  }

  moveForward() {
    if (this._index < this._history.length - 1) {
      this._index++;
      this._graph.fromJSON(this._history[this._index]);
    }
  }

  restore() {
    this._graph.fromJSON(this._history[0]);
  }
}
