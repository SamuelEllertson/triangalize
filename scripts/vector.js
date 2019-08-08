

function Vector(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Vector.prototype = {
  negative: function() {
    return new Vector(-this.x, -this.y, -this.z);
  },
  add: function(v) {
    this.x += v.x
    this.y += v.y
    return this
  },
  subtract: function(v) {
    this.x -= v.x
    this.y -= v.y
    return this
  },
  multiply: function(v) {
    this.x *= v.x
    this.y *= v.y
    return this
  },
  divide: function(v) {
    this.x /= v.x
    this.y /= v.y
    return this
  },
  equals: function(v) {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  },
  dot: function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  },
  length: function() {
    return Math.sqrt(this.dot(this));
  },
  unit: function() {
    return this.divide(this.length());
  },
  fastUnit: function() {
    if(this.x == 0 && this.y == 0)
      return this

    let length = Math.sqrt(this.x * this.x + this.y * this.y)
    this.x /= length
    this.y /= length
    return this
  },
  toArray: function(n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  },
  clone: function() {
    return new Vector(this.x, this.y, this.z);
  },
  init: function(x, y, z) {
    this.x = x; this.y = y; this.z = z;
    return this;
  },
  limit: function(maxVec) {
    this.x = this.x < 0 ? 0 : this.x 
    this.y = this.y < 0 ? 0 : this.y 

    this.x = this.x >= maxVec.x ? maxVec.x - 1 : this.x 
    this.y = this.y >= maxVec.y ? maxVec.y - 1 : this.y 
    return this;
  },
  clear: function(maxVec) {
    this.x = 0
    this.y = 0
    return this;
  },
  scale: function(val) {
    this.x *= val
    this.y *= val
    return this;
  },
  newScale: function(val) {
    return new Vector(this.x * val, this.y * val)
  },
  distanceSquared: function(v) {
    return (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y)
  },
  distanceQuad: function(v) {
    let squared = (this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y)

    return  squared * squared
  }
};

Vector.negative = function(a, b) {
  b.x = -a.x; b.y = -a.y; b.z = -a.z;
  return b;
};
Vector.add = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x + b.x; c.y = a.y + b.y; c.z = a.z + b.z; }
  else { c.x = a.x + b; c.y = a.y + b; c.z = a.z + b; }
  return c;
};
Vector.subtract = function(v1, v2) {
  return new Vector(v2.x - v1.x, v2.y - v1.y)
};
Vector.multiply = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x * b.x; c.y = a.y * b.y; c.z = a.z * b.z; }
  else { c.x = a.x * b; c.y = a.y * b; c.z = a.z * b; }
  return c;
};
Vector.divide = function(a, b, c) {
  if (b instanceof Vector) { c.x = a.x / b.x; c.y = a.y / b.y; c.z = a.z / b.z; }
  else { c.x = a.x / b; c.y = a.y / b; c.z = a.z / b; }
  return c;
};
Vector.cross = function(a, b, c) {
  c.x = a.y * b.z - a.z * b.y;
  c.y = a.z * b.x - a.x * b.z;
  c.z = a.x * b.y - a.y * b.x;
  return c;
};
Vector.unit = function(a, b) {
  var length = a.length();
  b.x = a.x / length;
  b.y = a.y / length;
  b.z = a.z / length;
  return b;
};
Vector.fromAngles = function(theta, phi) {
  return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi), Math.sin(theta) * Math.cos(phi));
};
Vector.randomDirection = function() {
  return Vector.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
};
Vector.min = function(a, b) {
  return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function(a, b) {
  return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function(a, b, fraction) {
  return b.subtract(a).multiply(fraction).add(a);
};
Vector.fromArray = function(a) {
  return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function(a, b) {
  return a.angleTo(b);
};

