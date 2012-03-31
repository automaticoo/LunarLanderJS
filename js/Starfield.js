/*global vector2d */
/*global line2d */

var starfield = Object.create({}, {
	stars : {
		value: [],
		writable: true,
		enumarable: true
	},
	canvas : {
		set:  function (value) {
			"use strict";
			this.context2d = value.getContext('2d');
		}
	},
	createStars : {
		value: function (number) {
			"use strict";
			var i;
			for (i = 0; i < number; i += 1) {
				this.stars.push({x: Math.random() * (600 * 3) - 600, y:  Math.random() * 480, movement: (0.5 - Math.random()) / 4});
			}
		}
	},
	update : {
		value: function () {
			"use strict";
			var star, i;
			for (i = 0; i < this.stars.length; i += 1) {
				star = this.stars[i];
				star.x += star.movement;
				if (star.x < -605) {
					star.x = 1205;
				} else if (star.x > 1205) {
					star.x = -605;
				}
			}
		}
	},
	draw : {
		value: function () {
			"use strict";
			var star, i;
			this.context2d.fillStyle = "white";
			this.context2d.beginPath();
			for (i = 0; i < this.stars.length; i += 1) {
				star = this.stars[i];
				this.context2d.arc(star.x, star.y, 1, Math.TAU, false);
			}
			this.context2d.fill();
			this.context2d.closePath();
		}
	}
});