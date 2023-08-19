import Shape from './Shape';

export default class Triangle extends Shape {
  constructor(vertices, edges, angles) {
    super('t');
    this._vertices = vertices;
    this._edges = edges;
    this._angles = angles;
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

  get desc() {
    if (
      this.vertices[0].desc &&
      this.vertices[1].desc &&
      this.vertices[2].desc
    ) {
      return (
        this.vertices[0].desc + this.vertices[1].desc + this.vertices[2].desc
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
