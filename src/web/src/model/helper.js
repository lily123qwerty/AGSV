export function degreesToRadians(d) {
  var angle = d * (Math.PI / 180);
  return angle;
}

export function radiansToDegrees(r) {
  var angle = (r * 180) / Math.PI;
  return angle;
}

//anti-clockwise rotate (x,y) by angle with origion (0,0)
export function rotate(x, y, beta, direction) {
  let r;
  if (x == 0) {
    if (y > 0) {
      r = Math.PI / 2;
    } else {
      r = (Math.PI / 2) * 3;
    }
  } else if (y == 0) {
    if (x > 0) {
      r = 0;
    } else {
      r = Math.PI;
    }
  } else {
    r = Math.atan(y / x);
    if (x < 0 && y <= 0) {
      r = r + Math.PI;
    } else if (x < 0) {
      r = r + Math.PI;
    } else if (y < 0) {
      r = r + 2 * Math.PI;
    }
  }
  r += beta * direction;
  var length = Math.sqrt(x ** 2 + y ** 2);
  x = length * Math.cos(r);
  y = length * Math.sin(r);
  return { x: x, y: y };
}

export function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
