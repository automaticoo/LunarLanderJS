Math.TAU = Math.PI * 2;
/*global Stats: true */
var stats = new Stats();

// Align top-left
stats.getDomElement().style.position = 'absolute';
stats.getDomElement().style.left = '0px';
stats.getDomElement().style.top = '0px';

document.body.appendChild(stats.getDomElement());

setInterval(function () {
	"use strict";
    stats.update();
}, 1000 / 60);

(function main() {
	"use strict";

	var x, renderable, circle, canvas, context2d, height, width, level, renderables, i;

	//declaration of function used later
	function clear() {
		context2d.fillStyle = 'black';
		context2d.beginPath();
		context2d.rect(0, 0, width, height);
		context2d.closePath();
		context2d.fill();
	}

	//declaration of function used later
	function createCircle(x, y, radius) {
		var returnCircle;

		returnCircle = Object.create(circle);
		returnCircle.x = x;
		returnCircle.y = y;
		returnCircle.radius = radius;

		return returnCircle;
	}

	renderable = Object.create({}, {
		x: {
			value: undefined,
			writable: true,
			enumarable: true
		},
		y: {
			value: undefined,
			writable: true,
			enumarable: true
		},
		render: {
			value: function (context2d) {
			}
		},
		update: {
			value: function () {
			}
		}
	});
	Object.freeze(renderable);

	circle = Object.create(renderable, {
		radius : {
			value: undefined,
			enumerable: true
		},
		render: {
			value: function (context2d) {
				context2d.fillStyle = 'rgba(255, 255, 255, 1)';
				context2d.beginPath();
				context2d.arc(this.x, this.y, this.radius, 0, Math.TAU, true);
				context2d.closePath();
				context2d.fill();
			}
		},
		update: {
			value: function () {
			}
		}
	});

	width = 600;
	x = 0;
	height = 480;
	renderables = [];

	canvas = document.getElementById('canvas');
	context2d = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;

	function loadLevel(number) {
		level = undefined;
		var json, request;
		request = new XMLHttpRequest();
		request.open("GET", "data/level" + number + ".json", false);
		request.onreadystatechange = function () {
			if (request.readyState === 4) { //&& request.status === 200
				json = JSON.parse(request.responseText);
				level = json;
			}
		};
		request.send(null);
	}

	loadLevel(1);

	function gameLoop() {
		clear();
		if (level !== undefined) {
			//alert(level.data.points.length);
			context2d.fillStyle = "black";
			context2d.strokeStyle = "white";
			context2d.beginPath();
			context2d.moveTo(0, height);
			for (i = 0; i < level.data.points.length; i += 1) {
				context2d.lineTo(level.data.points[i].x + x, level.data.points[i].y);
			}
			context2d.lineTo(width, height);
			context2d.fill();
			context2d.stroke();
			context2d.closePath();
		}
		for (i = 0; i < renderables.length; i += 1) {
			renderables[i].render(context2d);
			renderables[i].update();
		}
	}

	setInterval(gameLoop, 1000 / 60);

	gameLoop();
}());