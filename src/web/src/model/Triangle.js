import Shape from './Shape';
import Style from './Style';

export default class Triangle extends Shape {
  constructor(vertices, edges, angles, key, style) {
    super(key, style);
    this._vertices = vertices;
    this._edges = edges;
    this._angles = angles;
    if (!style) {
      this.style.visible = false;
      this.style.color = 'red';
    }
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

  static fromJSON(json, dots, lines, angles) {
    let obj = new Triangle(
      json.vertices.map((key) => dots[key]),
      json.edges.map((key) => lines[key]),
      json.angles.map((key) => angles[key]),
      json.key,
      Style.fromJSON(json.style)
    );
    return obj;
  }
}
