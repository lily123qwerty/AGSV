import Graph from './Graph';

export default class History {
  constructor(graph) {
    this.reset(graph || new Graph());
  }

  reset(graph) {
    this._history = [graph.toJSON()];
    this._index = 0;
  }

  get hasHistory() {
    return this._index > 0;
  }

  push(graph) {
    if (this._index < this._history.length - 1) {
      this._history.splice(this._index + 1, this._history.length);
    }
    this._history.push(graph.toJSON());
    this._index = this._history.length - 1;
  }

  moveBackward(graph) {
    if (this._index > 0) {
      this._index--;
      graph.fromJSON(this._history[this._index]);
    }
  }

  moveForward(graph) {
    if (this._index < this._history.length - 1) {
      this._index++;
      graph.fromJSON(this._history[this._index]);
    }
  }

  restore(graph) {
    graph.fromJSON(this._history[0]);
  }
}
