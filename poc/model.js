var graph = {
    dot: {},

    line: {},

    angle: {},

    triangle: {},
};

const x_min = 50;
const y_min = 50;
const default_side = 100;

var key_seq = 0;
function makeKey(prefix) {
    prefix = prefix || 'k';
    var key = prefix + key_seq;
    key_seq++;
    return key;
}

function addDot(x, y) {
    var key = makeKey('d');
    graph.dot[key] = {
        x: x,
        y: y,
    };
    return key;
}

function addLine(dk1, dk2) {
    for (var lk in graph.line) {
        var line = graph.line[lk];
        if (
            (line.dk1 == dk1 && line.dk2 == dk2) ||
            (line.dk1 == dk2 && line.dk2 == dk1)
        ) {
            return lk;
        }
    }
    var key = makeKey('l');
    var dot1 = graph.dot[dk1];
    var dot2 = graph.dot[dk2];

    graph.line[key] = {
        dk1: dk1,
        dk2: dk2,
        length: Math.sqrt((dot1.y - dot2.y) ** 2 + (dot1.x - dot2.x) ** 2),
    };
    return key;
}

function addAngle(dk, lk1, lk2) {
    var line1 = graph.line[lk1];
    var line2 = graph.line[lk2];
    if (
        (line1.dk1 != dk && line1.dk2 != dk) ||
        (line2.dk1 != dk && line2.dk2 != dk)
    ) {
        return 'error';
    }

    var x1 = graph.dot[dk].x;
    var y1 = graph.dot[dk].y;
    var x2 = graph.dot[line1.dk1].x;
    var y2 = graph.dot[line1.dk1].y;
    var x3 = graph.dot[line2.dk1].x;
    var y3 = graph.dot[line2.dk1].y;

    if (x1 == x2 && y1 == y2) {
        x2 = graph.dot[line1.dk2].x;
        y2 = graph.dot[line1.dk2].y;
    }
    if (x1 == x3 && y1 == y3) {
        x3 = graph.dot[line2.dk2].x;
        y3 = graph.dot[line2.dk2].y;
    }

    var r1;
    var r2;
    if (x2 == x1) {
        if (y2 > y1) {
            r1 = Math.PI / 2;
        } else {
            r1 = -Math.PI / 2;
        }
    } else {
        r1 = Math.atan((y2 - y1) / (x2 - x1));
        if (x2 < x1) {
            r1 = r1 - Math.PI;
        }
    }
    if (x3 == x1) {
        if (y3 > y1) {
            r2 = Math.PI / 2;
        } else {
            r2 = -Math.PI / 2;
        }
    } else {
        r2 = Math.atan((y3 - y1) / (x3 - x1));
        if (x3 < x1) {
            r2 = r2 - Math.PI;
        }
    }
    var r = r1 - r2;
    r = Math.abs(r);
    if (r > Math.PI) {
        r = 2 * Math.PI - r;
    }

    var key = makeKey('a');
    graph.angle[key] = {
        dk: dk,
        lk1: lk1,
        lk1r: r1,
        lk2: lk2,
        lk2r: r2,
        radian: r,
    };
    console.log(key, r1, r2);
    return key;
}

//anti-clockwise rotate (x,y) by angle
function rotate(x, y, beta, direction) {
    var angle;
    if (x == 0) {
        if (y > 0) {
            angle = Math.PI / 2;
        } else {
            angle = -Math.PI / 2;
        }
    } else {
        angle = Math.atan(y / x);
    }
    angle *= direction;
    angle += beta;
    var length = Math.sqrt(x ** 2 + y ** 2);
    x = length * Math.cos(angle);
    y = length * Math.sin(angle);
    return { x: x, y: y };
}

function addTriangleBy3Dot(dk1, dk2, dk3) {
    var tri_key = makeKey('t');
    var lk1, lk2, lk3, ak1, ak2, ak3;

    lk1 = addLine(dk1, dk2);
    lk2 = addLine(dk1, dk3);
    lk3 = addLine(dk2, dk3);
    ak1 = addAngle(dk1, lk1, lk2);
    ak2 = addAngle(dk2, lk1, lk3);
    ak3 = addAngle(dk3, lk3, lk2);
    graph.triangle[tri_key] = {
        vertices: [dk1, dk2, dk3],
        edges: [lk1, lk2, lk3],
        angles: [ak1, ak2, ak3],
    };
    return tri_key;
}

function addTriangleBy2Angle1Side(angle1, angle2, side1, direction) {
    direction = direction || 1;
    side1 = side1 || default_side;

    var x1 = x_min,
        y1 = y_min,
        x2,
        y2 = y_min,
        x3,
        y3;
    var dk1, dk2, dk3;

    if (typeof angle1 == 'string') {
        var angle = graph.angle[angle1];
        var dot1 = graph.dot[angle.dk];
    }

    angle1 = degreesToRadians(angle1);
    angle2 = degreesToRadians(angle2);

    if (typeof side1 == 'string') {
        //side is a line key
        var line = graph.line[side1];
        var dot1 = graph.dot[line.dk1];
        var dot2 = graph.dot[line.dk2];
        x1 = dot1.x;
        y1 = dot1.y;
        x2 = dot2.x;
        y2 = dot2.y;

        dk1 = line.dk1;
        dk2 = line.dk2;

        side1 = line.length;
    } else {
        x2 = side1 + x1;
        dk1 = addDot(x1, y1);
        dk2 = addDot(x2, y2);
    }

    var angle3 = Math.PI - angle1 - angle2;
    var side2 = (side1 / Math.sin(angle3)) * Math.sin(angle2);
    x3 = side2 * Math.cos(angle1);
    y3 = side2 * Math.sin(angle1);

    var beta;
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

    var r = rotate(x3, y3, beta, direction);
    x3 = r.x + x1;
    y3 = r.y + y1;

    dk3 = addDot(x3, y3);
    return addTriangleBy3Dot(dk1, dk2, dk3);
}

function addTriangleByInnerAngle2Side(angle1, side1, side2) {
    var x1 = 0,
        y1 = 0,
        x2 = side1,
        y2 = 0,
        x3,
        y3;
    angle1 = degreesToRadians(angle1);
    x3 = side2 * Math.cos(angle1);
    y3 = side2 * Math.sin(angle1);

    var dot_key_1 = addDot(x1, y1);
    var dot_key_2 = addDot(x2, y2);
    var dot_key_3 = addDot(x3, y3);
    return addTriangleBy3Dot(dot_key_1, dot_key_2, dot_key_3);
}

function addTriangleByOuterAngle2Side(angle1, side1, side2) {
    var x1 = 0,
        y1 = 0,
        x2 = side1,
        y2 = 0,
        x3,
        y3;
    angle1 = degreesToRadians(angle1);
    var angle3 = (Math.sin(angle1) / side2) * side1;
    angle3 = Math.asin(angle3);

    var angle2 = Math.PI - angle1 - angle3;
    x3 = side2 * Math.cos(angle2);
    y3 = side2 * Math.sin(angle2);

    var dot_key_1 = addDot(x1, y1);
    var dot_key_2 = addDot(x2, y2);
    var dot_key_3 = addDot(x3, y3);
    return addTriangleBy3Dot(dot_key_1, dot_key_2, dot_key_3);
}

function addTriangleBy3Side(side1, side2, side3) {
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

function addCircleByRadius(r) {}

function addCircleByCircumference(c) {}

function addParallelogram(angle, side1, side2) {}

function addTrapeziumBy4Side(s1, s2, s3, s4) {}

function addTrapeziumBy3Angle1Side(a1, a2, a3, s1) {}

function addTrapeziumBy2Angle3Side(a1, a2, s1, s2, s3) {}

function addPolygonByNumberLength(n, l) {}

function addPolygonByAngleLength(a, l) {}

function addPolygonByNumberPerimeter(n, p) {}

function addPolygonByAnglePerimeter(a, p) {}

function degreesToRadians(d) {
    var angle = d * (Math.PI / 180);
    return angle;
}

function radiansToDegrees(r) {
    var angle = (r * 180) / Math.PI;
    return angle;
}

function setDotStyle(dk, visible, size, color) {
    var dot = graph.dot[dk];
    dot.style = dot.style || {};

    dot.style.visible = visible || false;
    dot.style.size = size || dot.style.size || 5;
    dot.style.color = color || dot.style.color || 'black';
}

function setDotLabel(dk, label) {
    var dot = graph.dot[dk];
    dot.style = dot.style || {};

    dot.style.label = label;
}
