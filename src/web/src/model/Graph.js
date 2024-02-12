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
    this._key_seq = 0;
    this._dots = {};
    this._lines = {};
    this._angles = {};
    this._triangles = {};
    this._id = null;
    this._uid = null;
    this._question = '';
  }

  _makeKey(prefix) {
    prefix = prefix || 'k';
    return prefix + this._key_seq++;
  }

  get id() {
    return this._id;
  }

  set id(val) {
    this._id = val;
  }

  get uid() {
    return this._uid;
  }

  set uid(val) {
    this._uid = val;
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

  get question() {
    return this._question;
  }

  set question(val) {
    this._question = val;
  }

  get bounds() {
    let top = Number.MAX_VALUE,
      left = Number.MAX_VALUE,
      bottom = -Number.MAX_VALUE,
      right = -Number.MAX_VALUE;

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

  rotate(r, c) {
    if (r != 0) {
      c = c || this.center;
      Object.entries(this.dots).forEach(([key, obj]) => {
        const d = rotate(obj.x - c.x, obj.y - c.y, r);
        obj.x = d.x + c.x;
        obj.y = d.y + c.y;
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
      key_seq: this._key_seq,
      uid: this._uid,
      question: this._question,
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

    g._uid = json.uid;

    g._key_seq = json.key_seq;

    g._question = json.question;

    return g;
  }

  addDot(x, y) {
    let dot = new Dot(x, y, this._makeKey('d'));
    this.dots[dot.key] = dot;
    return dot;
  }

  addLine(shareLine, dot1, dot2) {
    if (shareLine && typeof shareLine == 'object') {
      return shareLine;
    }

    let line = new Line(dot1, dot2, this._makeKey('l'));
    this.lines[line.key] = line;
    return line;
  }

  addAngle(shareAngle, dot, line1, line2) {
    //TODO: check dk in lk1, lk2.

    // if (
    //     (line1.dk1 != dk && line1.dk2 != dk) ||
    //     (line2.dk1 != dk && line2.dk2 != dk)
    // ) {
    //     return 'error';
    // }
    //TODO: share angle
    if (shareAngle && typeof shareAngle == 'object') {
      shareAngle.addAngle(line1, line2);
      return shareAngle;
    }
    let angle2 = new Angle(dot, line1, line2, this._makeKey('a'));
    this.angles[angle2.key] = angle2;
    return angle2;
  }

  addTriangleBy3Dot(dot1, dot2, dot3, sa1, sa2, ss1, ss2, ss3) {
    //                dot3
    //               /     \
    //            side2      side3
    //            /              \
    //          dot1------side1----dot2
    let line1 = this.addLine(ss1, dot1, dot2);
    let line2 = this.addLine(ss2, dot1, dot3);
    let line3 = this.addLine(ss3, dot2, dot3);
    let angle1 = this.addAngle(sa1, dot1, line1, line2);
    let angle2 = this.addAngle(sa2, dot2, line1, line3);
    let angle3 = this.addAngle(null, dot3, line3, line2);

    let triangle = new Triangle(
      [dot1, dot2, dot3],
      [line1, line2, line3],
      [angle1, angle2, angle3],
      this._makeKey('t')
    );
    this.triangles[triangle.key] = triangle;
    return triangle;
  }

  addTriangleBy2Angle1Side(angle1, angle2, side1, direction) {
    direction = direction || 1;
    side1 = side1 || default_side;
    //                dot3
    //               /     \
    //            side2       \
    //            /              \
    //          dot1------side1----dot2
    let x1 = x_min,
      y1 = y_min,
      x2,
      y2 = y_min,
      x3,
      y3;
    let dot1, dot2, dot3;
    let shareAngle1 = null;
    let shareLine = null;
    let r = 0;

    if (typeof angle1 == 'object') {
      shareAngle1 = angle1;
      dot1 = angle1.vertex;
      x1 = dot1.x;
      y1 = dot1.y;
      let as1 = angle1.sides1[0].radian(dot1);
      let as2 = angle1.sides2[0].radian(dot1);

      // check which rotation is side1
      if (as1 > as2 && as1 - as2 > Math.PI) {
        r = as1;
      } else if (as1 > as2 && as1 - as2 < Math.PI) {
        r = as2;
      } else if (as1 < as2 && as2 - as1 > Math.PI) {
        r = as2;
      } else {
        r = as1;
      }

      angle1 = radiansToDegrees(angle1.radian);
    } else if (angle1 < 0) {
      angle1 = angle1 * -1;
      direction = -1;
    }

    if (angle2 < 0) {
      angle2 = angle2 * -1;
      direction = -1;
    }
    angle1 = degreesToRadians(angle1);
    angle2 = degreesToRadians(angle2);

    if (typeof side1 == 'object') {
      //side is a line key
      shareLine = side1;
      let line = side1;
      dot1 = line.ends[0];
      dot2 = line.ends[1];
      x1 = dot1.x;
      y1 = dot1.y;

      r = line.radian(dot1);
      side1 = line.length;
    }
    x2 = side1 * Math.cos(r) + x1;
    y2 = side1 * Math.sin(r) + y1;

    if (!dot1) {
      dot1 = this.addDot(x1, y1);
    }

    if (!dot2) {
      dot2 = this.addDot(x2, y2);
    }

    // calculate dot3 - relative to dot1 and side1
    let angle3 = Math.PI - angle1 - angle2;
    let side2 = (side1 / Math.sin(angle3)) * Math.sin(angle2);
    x3 = side2 * Math.cos(angle1);
    y3 = side2 * Math.sin(angle1);

    // get final dot1
    let rotatedDot = rotate(x3, y3, r);
    x3 = rotatedDot.x + x1;
    y3 = rotatedDot.y + y1;

    if (direction == -1) {
      let mid = { x: (x2 + x1) / 2, y: (y2 + y1) / 2 };
      x3 = mid.x + (mid.x - x3);
      y3 = mid.y + (mid.y - y3);
    }

    dot3 = this.addDot(x3, y3);
    return this.addTriangleBy3Dot(
      dot1,
      dot2,
      dot3,
      shareAngle1,
      null,
      shareLine,
      null,
      null
    );
  }

  addTriangleByInnerAngle2Side(angle1, side1, side2, direction) {
    //                dot3
    //               /     \
    //            side2      side3
    //            /              \
    //          dot1------side1----dot2
    direction = direction || 1;
    let x1 = x_min,
      y1 = y_min,
      x2,
      y2 = y_min,
      x3,
      y3;

    let dot1, dot2, dot3;
    let shareAngle = null;
    let shareLine1 = null;
    let shareLine2 = null;
    let r = 0;

    if (typeof angle1 == 'object') {
      shareAngle = angle1;
      dot1 = angle1.vertex;
      x1 = dot1.x;
      y1 = dot1.y;
      let as1 = angle1.sides1[0].radian(dot1);
      let as2 = angle1.sides2[0].radian(dot1);

      // check which rotation is side1
      if (as1 > as2 && as1 - as2 > Math.PI) {
        r = as1;
      } else if (as1 > as2 && as1 - as2 < Math.PI) {
        r = as2;
      } else if (as1 < as2 && as2 - as1 > Math.PI) {
        r = as2;
      } else {
        r = as1;
      }

      angle1 = radiansToDegrees(angle1.radian);
    }

    // TODO: need checking
    if (typeof side1 == 'object') {
      //side is a line key
      shareLine1 = side1;
      let line = side1;
      dot1 = line.ends[0];
      dot2 = line.ends[1];
      x1 = dot1.x;
      y1 = dot1.y;

      r = line.radian(dot1);
      side1 = line.length;
    }

    angle1 = degreesToRadians(angle1);
    x2 = side1 * Math.cos(r) + x1;
    y2 = side1 * Math.sin(r) + y1;

    x3 = side2 * Math.cos(angle1 + r) + x1;
    y3 = side2 * Math.sin(angle1 + r) + y1;

    if (!dot1) {
      dot1 = this.addDot(x1, y1);
    }

    if (!dot2) {
      dot2 = this.addDot(x2, y2);
    }

    if (!dot3) {
      dot3 = this.addDot(x3, y3);
    }

    return this.addTriangleBy3Dot(
      dot1,
      dot2,
      dot3,
      shareAngle,
      null,
      shareLine1,
      shareLine2,
      null
    );
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
