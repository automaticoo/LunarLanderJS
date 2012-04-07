/*global vector2d */
/*global circle2d */


var shipController = Object.create({}, {
	keysDown : {
		value : {},
		enumarable : true,
		writable : true
	},
	init : {
		value: function () {
			"use strict";
			var that = this;

			document.addEventListener("keydown", function (e) {
				that.keysDown[e.keyCode] = true;
			}, false);
			document.addEventListener("keyup", function (e) {
				that.keysDown[e.keyCode] = false;
			}, false);
		}
	},
	update : {
		value: function (ship) {
			"use strict";
			if (this.keysDown['38'] === true && ship.fuel > 0 && ship.thrust < 1) { // UP
				ship.thrust += 0.1;
				if (ship.thrust > 1) {
					ship.thrust  = 1;
				}
				this.keysDown['38'] = false;
			}
			if (this.keysDown['40'] === true && ship.thrust > 0) { // DOWN
				ship.thrust -= 0.1;
				if (ship.thrust < 0) {
					ship.thrust  = 0;
				}
				this.keysDown['40'] = false;
			}
			if (this.keysDown['37'] === true) { // LEFT
				ship.rotation += 1 / 18;
			}
			if (this.keysDown['39'] === true) { // RIGHT
				ship.rotation -= 1 / 18;
			}
		}
	}
});