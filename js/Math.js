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
	intersects : {
		value: function (shape) {
			"use strict";
			var points = [];
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

				subtracted.x = to.x - from.y;
				subtracted.y = to.y - from.y;
				this.vector.x = subtracted.x;
				this.vector.y = subtracted.y;
			} else {
				this.vector.x = from.x;
				this.vector.y = from.y;
			}
			this.length = this.vector.length;
			this.vector.normalize();
		}
	}
});