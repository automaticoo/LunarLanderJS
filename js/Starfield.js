/*global vector2d */
/*global line2d */

var starfield = Object.create({}, {
	stars : {
		value: [],
		writable: true,
		enumarable: true
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
		value: function (context2d) {
			"use strict";
			var star, i, imageData, index, y, xL, xR, xLA, xRA;

			function makePixelWhite(imageData, x, y, a) {
				index = (x + y * imageData.width) * 4;
				imageData.data[index] = 256;
				imageData.data[index + 1] = 256;
				imageData.data[index + 2] = 256;
				imageData.data[index + 3] = a;
			}

			imageData = context2d.createImageData(600, 480);

			for (i = 0; i < this.stars.length; i += 1) {
				star = this.stars[i];

				xL = Math.floor(star.x); //calculate left pixel
				xR = Math.ceil(star.x); //calculate right pixel

				xLA = star.x - xL; //calculate distance from real pixel to left pixel to get an alpha value
				xRA = xR - star.x; //calculate distance from right pixel to real pixel to get an alpha value

				y = parseInt(star.y, 10);

				makePixelWhite(imageData, xL, y, xRA * 255); // 0xff opaque
				makePixelWhite(imageData, xR, y, xLA * 255); // 0xff opaque
			}
			context2d.putImageData(imageData, 0, 0);
		}
	}
});