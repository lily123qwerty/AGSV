export function degreesToRadians(d) {
    var angle = d * (Math.PI / 180);
    return angle;
}

export function radiansToDegrees(r) {
    var angle = (r * 180) / Math.PI;
    return angle;
}

//anti-clockwise rotate (x,y) by angle
export function rotate(x, y, beta, direction) {
    var angle;
    if (x == 0) {
        if (y > 0) {
            angle = Math.PI / 2;
        } else {
            angle = -Math.PI / 2;
        }
    } else {
        //TODO: may be wrong!!!
        angle = Math.atan(y / x);
    }
    angle *= direction;
    angle += beta;
    var length = Math.sqrt(x ** 2 + y ** 2);
    x = length * Math.cos(angle);
    y = length * Math.sin(angle);
    return { x: x, y: y };
}
