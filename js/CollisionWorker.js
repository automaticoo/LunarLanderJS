/*global importScripts */
/*global circle2d */
/*global vector2d */
/*global line2d */
/*global self */

importScripts("Math.js");

var circle = Object.create(circle2d);
var lines;

circle = Object.create(circle2d, {
	test: {
		value: "hallo",
		writable: true,
		enumarable: true
	}
});

this.addEventListener("message", function (event) {
	"use strict";
	var message, i, linesData;

	message = JSON.parse(event.data);

	if (message.type === "ShipUpdate") {
		circle.x = message.data.x;
		circle.y = message.data.y;
		circle.radius = message.data.radius;
	} else if (message.type === "LinesUpdate") {
		lines = [];
		linesData = message.data;
		for (i = 0; i < linesData.length; i += 1) {
			lines[i] = Object.create(line2d);
			lines[i].x = linesData[i].x;
			lines[i].y = linesData[i].y;
			lines[i].x = linesData[i].x;
			lines[i].length = linesData[i].length;
			lines[i].vector = Object.create(vector2d);
			lines[i].vector.x = linesData[i].vector.x;
			lines[i].vector.y = linesData[i].vector.y;
		}
	} else if (message.type === "StopUpdate") {
		lines = undefined;
	}
});

function checkCollision() {
	"use strict";
	var i, ips;
	if (lines && circle) {
		for (i = 0; i < lines.length; i += 1) {
			ips = circle.intersectToLine(lines[i]);
			if (ips.length > 0) {
				self.postMessage(JSON.stringify({type: "collision", data: ips}));
			}
		}
	}
}

setInterval(checkCollision, 1000 / 60);