Math.TAU = Math.PI * 2;
/*global Stats: true */
/*global level */
/*global ship */
/*global vector2d */
/*global starfield */

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

	var canvas, context2d, height, width, line;

    ship.sound = document.getElementById('thruster');

	level.width = width = 600;
	level.height = height = 480;

	level.canvas = document.getElementById('background');
	level.loadLevel(1);

	starfield.canvas = document.getElementById('game');
	starfield.createStars(100);

	ship.canvas = document.getElementById('game');
	ship.reset();
	ship.fuel = 1000;

	canvas = document.getElementById('game');
	canvas.width = width;
	canvas.height = height;
	context2d = canvas.getContext('2d');

	function gameLoop() {
		var i;

        context2d.clearRect(0, 0, width, height);
		level.draw();

		starfield.update();
		starfield.draw();

		ship.update();
		ship.draw();
		ship.circle.draw(context2d);

		for (i = 0; i < level.lines.length; i += 1) {
			if (ship.circle.intersectToLine(level.lines[i]).length > 0) {
				level.lines[i].color = 'red';
			}
		}
	}
	document.onkeydown = function (event) {
		if (event.keyCode === 38 && ship.fuel > 0 && ship.thrust < 1) { // UP
			ship.thrust += 0.1;
			if (ship.thrust > 1) {
				ship.thrust  = 1;
			}
		}
		if (event.keyCode === 40 && ship.thrust > 0) { // DOWN
			ship.thrust -= 0.1;
			if (ship.thrust < 0) {
				ship.thrust  = 0;
			}
		}
		if (event.keyCode === 37) { // LEFT
			ship.rotation += 1 / 18;
		}
		if (event.keyCode === 39) { // RIGHT
			ship.rotation -= 1 / 18;
		}
	};

	setInterval(gameLoop, 1000 / 60);

	gameLoop();
};