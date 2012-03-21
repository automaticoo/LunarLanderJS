Math.TAU = Math.PI * 2;
/*global Stats: true */
/*global level */

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

window.onload = function main() {
	"use strict";

	var canvas, context2d, height, width, i;

	//declaration of function used later
	function clear() {
		context2d.clearRect(0, 0, width, height);
	}

	level.width = width = 600;
	level.height = width = 480;

	level.canvas = document.getElementById('background');
	level.loadLevel(1, function (json) {
		level.data = json.data;
		level.drawLevel(context2d);
	});

	canvas = document.getElementById('game');
	context2d = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;

	function gameLoop() {
		clear();
	}
	document.onkeydown = function (event) {
		if (event.keyCode === 37) {
			level.x -= 1;
		}
		if (event.keyCode === 39) {
			level.x += 1;
		}
	};

	setInterval(gameLoop, 1000 / 60);

	gameLoop();
};