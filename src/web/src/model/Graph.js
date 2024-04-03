import { degreesToRadians, radiansToDegrees, rotate } from './helper';
import Dot from './Dot';
import Line from './Line';
import Angle from './Angle';
import Triangle from './Triangle';
import Circle from './Circle';
import Shape from './Shape';

const x_min = 50;
const y_min = 50;
const default_side = 100;

export default class Graph {
  constructor() {
    this._init();
  }

  _init() {
    this._id = null;
    this._question = '';

    //Shapes
    this._key_seq = 0;
    this._dots = {};
    this._lines = {};
    this._angles = {};
    this._triangles = {};
    this._circles = {};

    //Meta Info
    this._category = '';
    this._published = false;
    this._highlighted = false;
    this._lastEdited = null;

    //Owner Info
    this._uid = null;
    this._ownerEmail = null;
    this._ownerPhoto = null;
    this._ownerName = null;
  }

  toJSON() {
    const json = {
      dots: Object.entries(this.dots).map(([key, obj]) => obj.toJSON()),
      lines: Object.entries(this.lines).map(([key, obj]) => obj.toJSON()),
      angles: Object.entries(this.angles).map(([key, obj]) => obj.toJSON()),
      triangles: Object.entries(this.triangles).map(([key, obj]) =>
        obj.toJSON()
      ),
      key_seq: this._key_seq,
      question: this._question,
      published: this._published,
      highlighted: this._highlighted,
      category: this._category,
    };

    if (this._id) json.id = this.id;
    if (this._lastEdited) json.lastEdited = this._lastEdited;
    if (this._uid) json.uid = this._uid;
    if (this._ownerEmail) json.ownerEmail = this._ownerEmail;
    if (this._ownerPhoto) json.ownerPhoto = this._ownerPhoto;
    if (this._ownerName) json.ownerName = this._ownerName;

    return json;
  }

  fromJSON(json) {
    this._init();

    json.dots.forEach((j) => {
      let obj = Dot.fromJSON(j);
      this.dots[obj.key] = obj;
    });

    json.lines.forEach((j) => {
      let obj = Line.fromJSON(j, this.dots);
      this.lines[obj.key] = obj;
    });

    json.angles.forEach((j) => {
      let obj = Angle.fromJSON(j, this.dots, this.lines);
      this.angles[obj.key] = obj;
    });

    json.triangles.forEach((j) => {
      let obj = Triangle.fromJSON(j, this.dots, this.lines, this.angles);
      this.triangles[obj.key] = obj;
    });

    this._id = json.id || null;
    this._key_seq = json.key_seq;
    this._question = json.question || '';
    this._published = json.published || false;
    this._highlighted = json.highlighted || false;
    this._category = json.category || '';
    this._uid = json.uid || null;
    this._ownerEmail = json.ownerEmail || null;
    this._ownerPhoto = json.ownerPhoto || null;
    this._ownerName = json.ownerName || null;
    this._lastEdited = json.lastEdited || null;
  }

  static fromJSON(json) {
    const g = new Graph();
    g.fromJSON(json);
    return g;
  }

  static fromDoc(doc) {
    const g = Graph.fromJSON(doc.data());
    g.id = doc.id;
    return g;
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

  get ownerEmail() {
    return this._ownerEmail;
  }

  set ownerEmail(val) {
    this._ownerEmail = val;
  }

  get ownerPhoto() {
    return this._ownerPhoto;
  }

  set ownerPhoto(val) {
    this._ownerPhoto = val;
  }

  get ownerName() {
    return this._ownerName;
  }

  set ownerName(val) {
    this._ownerName = val;
  }

  get lastEdited() {
    return this._lastEdited && new Date(this._lastEdited.seconds * 1000);
  }

  set lastEdited(val) {
    this._lastEdited = val;
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

  get circles() {
    return this._circles;
  }

  get question() {
    return this._question;
  }

  set question(val) {
    this._question = val;
  }

  get published() {
    return this._published;
  }

  set published(val) {
    this._published = val;
  }

  get highlighted() {
    return this._highlighted;
  }

  set highlighted(val) {
    this._highlighted = val;
  }

  get category() {
    return this._category;
  }

  set category(val) {
    this._category = val;
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
    Object.entries(this.circles).forEach(([key, obj]) => {
      if (obj.semiCircle) {
        const r = obj.diameter.radian(obj.diameter.ends[0]);
        if (r < Math.PI) {
          left = Math.min(left, obj.center.x - obj.radius);
          if (r < Math.PI / 2) {
            top = Math.min(top, obj.center.y + obj.radius);
          } else {
            bottom = Math.max(bottom, obj.center.y - obj.radius);
          }
        } else {
          right = Math.max(right, obj.center.x + obj.radius);
          if (r > (Math.PI / 2) * 3) {
            top = Math.min(top, obj.center.y + obj.radius);
          } else {
            bottom = Math.max(bottom, obj.center.y - obj.radius);
          }
        }
      } else {
        top = Math.min(top, obj.center.y - obj.radius);
        left = Math.min(left, obj.center.x - obj.radius);
        bottom = Math.max(bottom, obj.center.y + obj.radius);
        right = Math.max(right, obj.center.x + obj.radius);
      }
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
    } else if (angle1 < 0) {
      angle1 = angle1 * -1;
      direction = -1;
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
      if (direction == -1) {
        let mid = { x: (x2 + x1) / 2, y: (y2 + y1) / 2 };
        x3 = mid.x + (mid.x - x3);
        y3 = mid.y + (mid.y - y3);
      }
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

  addTriangleByOuterAngle2Side(angle1, side1, side3, direction) {
    //                dot3
    //               /     \
    //            side2      side3
    //            /              \
    //          dot1------side1----dot2
    direction = direction || 1;
    let x1 = x_min,
      y1 = y_min,
      x2,
      y2,
      x3,
      y3;

    let dot1, dot2, dot3;
    let shareAngle = null;
    let shareLine1 = null;
    let shareLine3 = null;
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
    } else if (angle1 < 0) {
      angle1 = angle1 * -1;
      direction = -1;
    }

    if (typeof side1 == 'object') {
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

    if (typeof side3 == 'object') {
      //side is a line key
      shareLine3 = side3;
      let line = side3;
      dot2 = side3.ends[0];
      dot3 = side3.ends[1];
      x2 = dot2.x;
      y2 = dot2.y;
      x3 = dot3.x;
      y3 = dot3.y;

      let angle2 =
        Math.PI - angle1 - Math.asin((Math.sin(angle1) * side1) / side3.length);
      r = side3.radian(dot2) + angle2 - Math.PI;
      x1 = Math.cos(line.radian(dot2) + angle2) * side1 + x2;
      y1 = Math.sin(line.radian(dot2) + angle2) * side1 + y2;

      if (direction == -1) {
        let mid = { x: (x3 + x2) / 2, y: (y3 + y2) / 2 };
        x1 = mid.x + (mid.x - x1);
        y1 = mid.y + (mid.y - y1);
        dot1 = this.addDot(x1, y1);
      }

      side3 = line.length;
    }

    x2 = side1 * Math.cos(r) + x1;
    y2 = side1 * Math.sin(r) + y1;

    let angle2 =
      Math.PI - angle1 - Math.asin((Math.sin(angle1) * side1) / side3);
    x3 = side3 * Math.cos(Math.PI + r - angle2) + x2;
    y3 = side3 * Math.sin(Math.PI + r - angle2) + y2;

    if (!dot1) {
      dot1 = this.addDot(x1, y1);
    }

    if (!dot2) {
      dot2 = this.addDot(x2, y2);
    }

    if (!dot3) {
      if (direction == -1) {
        let mid = { x: (x2 + x1) / 2, y: (y2 + y1) / 2 };
        x3 = mid.x + (mid.x - x3);
        y3 = mid.y + (mid.y - y3);
      }
      dot3 = this.addDot(x3, y3);
    }

    return this.addTriangleBy3Dot(
      dot1,
      dot2,
      dot3,
      shareAngle,
      null,
      shareLine1,
      null,
      shareLine3
    );
  }

  addTriangleBy3Side(side1, side2, side3, direction) {
    direction = direction || 1;
    //                dot3
    //               /     \
    //            side2       \
    //            /              \
    //          dot1------side1----dot2
    let x1 = x_min,
      y1 = y_min,
      x2,
      y2,
      x3,
      y3;
    let dot1, dot2, dot3;
    let shareLine = null;
    let r = 0;

    console.log(side1, side2, side3);

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

    let angle1 = Math.acos(
      (side1 * side1 + side2 * side2 - side3 * side3) / 2 / side1 / side2
    );

    x3 = Math.cos(angle1 + r) * side2 + x1;
    y3 = Math.sin(angle1 + r) * side2 + y1;

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
      null,
      null,
      shareLine,
      null,
      null
    );
  }

  // TODO: check
  addCircle(c, radius, semiCircle, diameter) {
    // create a circle

    // create a circle with shared diameter

    // create a circle with shared radius

    // create a semi-circle

    // create a semi-circle with shared diameter
    // all center situation
    if (!c) {
      if (typeof radius == 'object') {
        c = radius.ends[0];
        radius = radius.length;
      } else if (typeof diameter == 'object') {
        c = {
          x: (diameter.ends[0].x + diameter.ends[1].x) / 2,
          y: (diameter.ends[0].y + diameter.ends[1].y) / 2,
        };
      } else {
        c = { x: 50, y: 50 };
      }
    }
    if (!(c instanceof Dot)) {
      c = this.addDot(c.x, c.y);
    }
    // create a semi-circle
    if (semiCircle) {
      if (!(typeof diameter == 'object')) {
      }
      diameter = this.addLine(diameter, c.x - radius, c.x + radius);
    }

    let circle = new Circle(
      c,
      radius,
      semiCircle,
      diameter,
      this._makeKey('c')
    );
    this.circles[circle.key] = circle;
    return circle;
  }

  addParallelogram(angle, side1, side2) {}

  addTrapeziumBy4Side(s1, s2, s3, s4) {}

  addTrapeziumBy3Angle1Side(a1, a2, a3, s1) {}

  addTrapeziumBy2Angle3Side(a1, a2, s1, s2, s3) {}

  addPolygonByNumberLength(n, l) {}

  addPolygonByAngleLength(a, l) {}

  addPolygonByNumberPerimeter(n, p) {}

  addPolygonByAnglePerimeter(a, p) {}
}
