import Shape from './Shape';

export default class Triangle extends Shape {
  constructor(vertices, edges, angles) {
    super('t');
    this._vertices = vertices;
    this._edges = edges;
    this._angles = angles;
    this.style.visible = false;
    this.style.color = 'red';
  }

  get vertices() {
    return this._vertices;
  }

  get edges() {
    return this._edges;
  }

  get angles() {
    return this._angles;
  }

  get area() {
    let a = this.edges[0].length;
    let b = this.edges[1].length;
    let c = this.edges[2].length;
    let s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  get label() {
    if (
      this.vertices[0].label &&
      this.vertices[1].label &&
      this.vertices[2].label
    ) {
      return (
        this.vertices[0].label + this.vertices[1].label + this.vertices[2].label
      );
    } else {
      return null;
    }
  }

  toJSON() {
    let json = super.toJSON();
    json.vertices = this.vertices.map((obj) => obj.key);
    json.edges = this.edges.map((obj) => obj.key);
    json.angles = this.angles.map((obj) => obj.key);
    return json;
  }
}
