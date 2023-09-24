import { degreesToRadians, radiansToDegrees, rotate } from './helper';
import Dot from './Dot';
import Line from './Line';
import Angle from './Angle';
import Triangle from './Triangle';
import Shape from './Shape';

const x_min = 50;
const y_min = 50;
const default_side = 100;

export default class Graph {
  constructor() {
    this._dots = {};
    this._lines = {};
    this._angles = {};
    this._triangles = {};
  }

  get dots() {
    return this._dots;
  }

  get lines() {
    return this._lines;
  }

  get angles() {
    return this._angles;
  }

  get triangles() {
    return this._triangles;
  }

  get bounds() {
    let top = Number.MAX_VALUE,
      left = Number.MAX_VALUE,
      bottom = Number.MIN_VALUE,
      right = Number.MIN_VALUE;

    Object.entries(this.dots).forEach(([key, obj]) => {
      top = Math.min(top, obj.y);
      left = Math.min(left, obj.x);
      bottom = Math.max(bottom, obj.y);
      right = Math.max(right, obj.x);
    });

    return { top, left, bottom, right };
  }

  get center() {
    let x, y;
    let b = this.bounds;
    x = (b.left + b.right) / 2;
    y = (b.top + b.bottom) / 2;

    return { x, y };
  }

  translate(x, y) {
    if (x != 0 || y != 0) {
      Object.entries(this.dots).forEach(([key, obj]) => {
        obj.x += x;
        obj.y += y;
      });
    }
  }

  toJSON() {
    return {
      dots: Object.entries(this.dots).map(([key, obj]) => obj.toJSON()),
      lines: Object.entries(this.lines).map(([key, obj]) => obj.toJSON()),
      angles: Object.entries(this.angles).map(([key, obj]) => obj.toJSON()),
      triangles: Object.entries(this.triangles).map(([key, obj]) =>
        obj.toJSON()
      ),
      key_seq: Shape.key_seq,
    };
  }

  static fromJSON(json) {
    let g = new Graph();

    json.dots.forEach((j) => {
      let obj = Dot.fromJSON(j);
      g.dots[obj.key] = obj;
    });

    json.lines.forEach((j) => {
      let obj = Line.fromJSON(j, g.dots);
      g.lines[obj.key] = obj;
    });

    json.angles.forEach((j) => {
      let obj = Angle.fromJSON(j, g.dots, g.lines);
      g.angles[obj.key] = obj;
    });

    json.triangles.forEach((j) => {
      let obj = Triangle.fromJSON(j, g.dots, g.lines, g.angles);
      g.triangles[obj.key] = obj;
    });

    Shape.key_seq = json.key_seq;

    return g;
  }

  addDot(x, y) {
    let dot = new Dot(x, y);
    this.dots[dot.key] = dot;
    return dot;
  }

  addLine(dot1, dot2) {
    for (let key in this.lines) {
      let line = this.lines[key];
      if (
        (line.ends[0] == dot1 && line.ends[1] == dot2) ||
        (line.ends[0] == dot2 && line.ends[1] == dot1)
      ) {
        return line;
      }
    }

    let line = new Line(dot1, dot2);
    this.lines[line.key] = line;
    return line;
  }

  addAngle(dot, line1, line2) {
    //TODO: check dk in lk1, lk2.

    // if (
    //     (line1.dk1 != dk && line1.dk2 != dk) ||
    //     (line2.dk1 != dk && line2.dk2 != dk)
    // ) {
    //     return 'error';
    // }

    let angle = new Angle(dot, line1, line2);
    this.angles[angle.key] = angle;
    return angle;
  }

  addTriangleBy3Dot(dot1, dot2, dot3) {
    let line1 = this.addLine(dot1, dot2);
    let line2 = this.addLine(dot1, dot3);
    let line3 = this.addLine(dot2, dot3);
    let angle1 = this.addAngle(dot1, line1, line2);
    let angle2 = this.addAngle(dot2, line1, line3);
    let angle3 = this.addAngle(dot3, line3, line2);

    let triangle = new Triangle(
      [dot1, dot2, dot3],
      [line1, line2, line3],
      [angle1, angle2, angle3]
    );
    this.triangles[triangle.key] = triangle;
    return triangle;
  }

  addTriangleBy2Angle1Side(angle1, angle2, side1, direction) {
    direction = direction || 1;
    side1 = side1 || default_side;

    let x1 = x_min,
      y1 = y_min,
      x2,
      y2 = y_min,
      x3,
      y3;
    let dot1, dot2, dot3;

    if (typeof angle1 == 'object') {
      let angle = angle1;
      let dot1 = angle.vertex;
      x1 = dot1.x;
      x2 = dot1.y;

      angle1 = angle.radian;
    }

    angle1 = degreesToRadians(angle1);
    angle2 = degreesToRadians(angle2);

    if (typeof side1 == 'object') {
      //side is a line key
      let line = side1;
      dot1 = line.ends[0];
      dot2 = line.ends[1];
      x1 = dot1.x;
      y1 = dot1.y;
      x2 = dot2.x;
      y2 = dot2.y;

      side1 = line.length;
    } else {
      x2 = side1 + x1;
      dot1 = this.addDot(x1, y1);
      dot2 = this.addDot(x2, y2);
    }

    let angle3 = Math.PI - angle1 - angle2;
    let side2 = (side1 / Math.sin(angle3)) * Math.sin(angle2);
    x3 = side2 * Math.cos(angle1);
    y3 = side2 * Math.sin(angle1);

    let beta;
    if (x2 - x1 == 0) {
      if (y2 - y1 > 0) {
        beta = Math.PI / 2;
      } else {
        beta = -Math.PI / 2;
      }
    } else {
      beta = Math.atan((y2 - y1) / (x2 - x1));
      if (x2 < x1) beta = beta - Math.PI;
    }

    let r = rotate(x3, y3, beta, direction);
    x3 = r.x + x1;
    y3 = r.y + y1;

    dot3 = this.addDot(x3, y3);
    return this.addTriangleBy3Dot(dot1, dot2, dot3);
  }

  addTriangleByInnerAngle2Side(angle1, side1, side2) {
    let x1 = 0,
      y1 = 0,
      x2 = side1,
      y2 = 0,
      x3,
      y3;
    angle1 = degreesToRadians(angle1);
    x3 = side2 * Math.cos(angle1);
    y3 = side2 * Math.sin(angle1);

    let dot1 = this.addDot(x1, y1);
    let dot2 = this.addDot(x2, y2);
    let dot3 = this.addDot(x3, y3);
    return this.addTriangleBy3Dot(dot1, dot2, dot3);
  }

  addTriangleByOuterAngle2Side(angle1, side1, side2) {
    let x1 = 0,
      y1 = 0,
      x2 = side1,
      y2 = 0,
      x3,
      y3;
    angle1 = degreesToRadians(angle1);
    let angle3 = (Math.sin(angle1) / side2) * side1;
    angle3 = Math.asin(angle3);

    let angle2 = Math.PI - angle1 - angle3;
    x3 = side2 * Math.cos(angle2);
    y3 = side2 * Math.sin(angle2);

    let dot1 = this.addDot(x1, y1);
    let dot2 = this.addDot(x2, y2);
    let dot3 = this.addDot(x3, y3);
    return this.addTriangleBy3Dot(dot1, dot2, dot3);
  }

  addTriangleBy3Side(side1, side2, side3) {
    var x1 = 0,
      y1 = 0,
      x2 = side1,
      y2 = 0,
      x3,
      y3;
    var angle1 =
      (side1 * side1 + side3 * side3 - side2 * side2) / (2 * side1 * side3);
    angle1 = Math.acos(angle1);
    x3 = side3 * Math.cos(angle1);
    y3 = side3 * Math.sin(angle1);

    var dot_key_1 = addDot(x1, y1);
    var dot_key_2 = addDot(x2, y2);
    var dot_key_3 = addDot(x3, y3);
    return addTriangleBy3Dot(dot_key_1, dot_key_2, dot_key_3);
  }

  addCircleByRadius(r) {}

  addCircleByCircumference(c) {}

  addParallelogram(angle, side1, side2) {}

  addTrapeziumBy4Side(s1, s2, s3, s4) {}

  addTrapeziumBy3Angle1Side(a1, a2, a3, s1) {}

  addTrapeziumBy2Angle3Side(a1, a2, s1, s2, s3) {}

  addPolygonByNumberLength(n, l) {}

  addPolygonByAngleLength(a, l) {}

  addPolygonByNumberPerimeter(n, p) {}

  addPolygonByAnglePerimeter(a, p) {}
}
