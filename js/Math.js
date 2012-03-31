/*global leftProjection */
/*global rightProjection */

var vector2d = Object.create({}, {
	x : {
		value: 0,
		writable: true,
		enumarable: true
	},
	y : {
		value: 0,
		writable: true,
		enumarable: true
	},
	dot: {
		value: function (v2) {
			"use strict";
			return (this.x * v2.x) + (this.y * v2.y);
		}
	},
	scale: {
		value: function (value) {
			"use strict";
			this.x *= value;
			this.y *= value;
			return this;
		}
	},
	cross: {
		value: function (v2) {
			"use strict";
			return Math.abs((this.x * v2.y) - (this.y * v2.x));
		}
	},
	leftProjection: {
		value: function (v2) {
			"use strict";
			var returnVector = Object.create(vector2d);
			returnVector.x = this.dot(v2) * v2.x;
			returnVector.y = this.dot(v2) * v2.y;
			return returnVector;
		}
	},
	rightProjection: {
		value: function (v2) {
			"use strict";
			var returnVector = Object.create(vector2d);
			returnVector.x = -1 * this.dot(v2.leftNormal) * v2.leftNormal.x;
			returnVector.y = -1 * this.dot(v2.leftNormal) * v2.leftNormal.y;
			return returnVector;
		}
	},
	reflection: {
		value: function (v2) {
			"use strict";
			var returnVector = Object.create(vector2d);
			returnVector.x = leftProjection(v2).x + rightProjection(v2).x;
			returnVector.y = leftProjection(v2).y + rightProjection(v2).y;
			return returnVector;
		}
	},
	length: {
		get: function () {
			"use strict";
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},
		set: function (value) {
			"use strict";
			this.normalize();
			this.x *= value;
			this.y *= value;
		}
	},
	rotation: {
		get: function () {
			"use strict";
			return Math.atan2(this.y, this.x);
		},
		set: function (radians) {
			"use strict";
			this.x = Math.cos(radians);
			this.y = Math.sin(radians);
		}
	},
	normalize: {
		value: function () {
			"use strict";
			var oldLength = this.length;

			this.x /= oldLength;
			this.y /= oldLength;
		}
	},
	add: {
		value: function (v2) {
			"use strict";
			this.x += v2.x;
			this.y += v2.y;
		}
	},
	copy: {
		get: function () {
			"use strict";
			var temp = Object.create(vector2d);
			temp.x = this.x;
			temp.y = this.y;
			return temp;
		}
	}
});

var basicShape = Object.create({}, {
	x : {
		value: 0,
		writable: true,
		enumarable: true
	},
	y : {
		value: 0,
		writable: true,
		enumarable: true
	},
	originalPoint : {
		value: Object.create(vector2d),
		writable: true,
		enumarable: true
	},
	color : {
		value: "white",
		writable: true,
		enumarable: true
	},
	lineWidth: {
		value: 0.6,
		writable: true,
		enumarable: true
	},
	rotation: {
		set: function (rotation) {
			"use strict";
			var a, b, c, d;
			//matrix: (We only need to rotate so we only need the skew and scale parameters abcd
				//a  b  u
				//c  d  v
				//tx ty w
			this.localRotation = rotation;

			a = Math.cos(rotation); //x scale
			b = Math.sin(rotation); //y skew
			c = -b;					//x skew
			d = a;					//y scale

			//POINT*MATRIX -> (would be the same as we create a m = new Matrix() m.rotate(rotation) m.transformPoint(this.x, this.y)
			this.x = (this.originalPoint.x * a) + this.originalPoint.y * c;
			this.y = (this.originalPoint.x * b) + this.originalPoint.y * d;
		},
		get: function (rotation) {
			"use strict";
			if (!this.localRotation) {
				this.localRotation = 0;
			}
			return this.localRotation;
		}
	}
});

var circle2d = Object.create(basicShape, {
	radius: {
		value: undefined,
		writable: true,
		enumarable: true
	},
	centerToPoint: {
		value: function (ip) {
			"use strict";
			var temp;

			if (ip === undefined) {
				return undefined;
			}

			temp = Object.create(vector2d);
			temp.x = ip.x - this.x;
			temp.y = ip.y - this.y;
			temp.normalize();
			return temp;
		}
	},
	intersectToLine: {
		value: function (l1) {
			"use strict";
			var points, A, B, dirLine, dirLineCircle, a, b, c, discriminant, e, u1, u2, interpolate;

			interpolate = function (pt1, pt2, f) {
				var x, y;
				x = f * pt1.x + (1 - f) * pt2.x;
				y = f * pt1.y + (1 - f) * pt2.y;
				return {x: x, y: y};
			};

			points = [];

			A = l1.A;
			B = l1.B;

			dirLine = Object.create(vector2d);
			dirLine = l1.vector.copy.scale(l1.length);
			dirLineCircle = Object.create(vector2d);
			dirLineCircle.x = A.x - this.x;
			dirLineCircle.y = A.y - this.y;

			a = dirLine.dot(dirLine);
			b = 2 * dirLineCircle.dot(dirLine);
			c = dirLineCircle.dot(dirLineCircle) - this.radius * this.radius;

			discriminant = b * b - 4 * a * c;

			if (discriminant <= 0) {
				return points;
			}

			e = Math.sqrt(discriminant);
			u1 = (-b + e) / (2 * a);
			u2 = (-b - e) / (2 * a);

			if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
				return points;
			}
			if (0 <= u2 && u2 <= 1) {
				points[0] = interpolate(A, B, 1 - u2);
			}
			if (0 <= u1 && u1 <= 1) {
				points[1] = interpolate(A, B, 1 - u1);
			}
			return points;
		}
	},
	containsOrIntersectsLine: {
		value: function (l1) {
			"use strict";
			var points, A, B, dirLine, dirLineCircle, a, b, c, discriminant, e, u1, u2, interpolate;

			interpolate = function (pt1, pt2, f) {
				var x, y;
				x = f * pt1.x + (1 - f) * pt2.x;
				y = f * pt1.y + (1 - f) * pt2.y;
				return {x: x, y: y};
			};

			points = [];

			A = l1.A;
			B = l1.B;

			dirLine = Object.create(vector2d);
			dirLine = l1.vector.copy.scale(l1.length);
			dirLineCircle = Object.create(vector2d);
			dirLineCircle.x = A.x - this.x;
			dirLineCircle.y = A.y - this.y;

			a = dirLine.dot(dirLine);
			b = 2 * dirLineCircle.dot(dirLine);
			c = dirLineCircle.dot(dirLineCircle) - this.radius * this.radius;

			discriminant = b * b - 4 * a * c;

			if (discriminant <= 0) {
				return false;
			}

			e = Math.sqrt(discriminant);
			u1 = (-b + e) / (2 * a);
			u2 = (-b - e) / (2 * a);

			if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
				if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
					return false;
				}
				return true;
			}
		}
	},
	intersectToCircle: {
		value: function (c2) {
			"use strict";
		}
	},
	draw: {
		value: function (context2d) {
			"use strict";

			context2d.strokeStyle = this.color;
			context2d.lineWidth = this.lineWidth;
			context2d.beginPath();
			//circle
			context2d.arc(this.x, this.y, this.radius, 0, Math.TAU, true);
			context2d.stroke();
			context2d.closePath();
		}
	}
});

var line2d = Object.create(basicShape, {
	vector: {
		value: undefined,
		writable: true,
		enumarable: true
	},
	length: {
		value: undefined,
		writable: false,
		enumarable: true
	},
	defineFromPoints: {
		value: function (to, from) {
			"use strict";
			var subtracted = {x: 0, y: 0};

			this.vector = Object.create(vector2d);
			if (from !== undefined) {
				this.x = from.x;
				this.y = from.y;

				subtracted.x = to.x - from.x;
				subtracted.y = to.y - from.y;

				this.vector.x = subtracted.x;
				this.vector.y = subtracted.y;
			} else {
				this.vector.x = from.x;
				this.vector.y = from.y;
			}
			this.length = this.vector.length;
			this.vector.normalize();
			this.originalPoint.x = this.x;
			this.originalPoint.y = this.y;
			return this;
		}
	},
	rotation: {
		set: function (rotation) {
			"use strict";
			var a, b, c, d;

			this.vector.rotation += rotation - this.rotation;

			Object.getPrototypeOf(Object.getPrototypeOf(this)).rotation = rotation;
		},
		get: function () {
			"use strict";
			return Object.getPrototypeOf(Object.getPrototypeOf(this)).rotation;
		}
	},
	draw: {
		value: function (context2d) {
			"use strict";

			context2d.strokeStyle = this.color;
			context2d.lineWidth = this.lineWidth;
			context2d.beginPath();
			//circle
			context2d.moveTo(this.x, this.y);
			context2d.lineTo(this.x + this.vector.x * this.length, this.y + this.vector.y * this.length);
			context2d.stroke();
			context2d.closePath();
		}
	},
	A: {
		get: function () {
			"use strict";
			var temp = Object.create(vector2d);
			temp.x = this.x;
			temp.y = this.y;
			return temp;
		}
	},
	B: {
		get: function () {
			"use strict";
			var temp = Object.create(vector2d);
			temp.x = this.x + this.vector.x * this.length;
			temp.y = this.y + this.vector.y * this.length;
			return temp;
		}
	}
});