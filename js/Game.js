Math.TAU = Math.PI * 2;
/*global Stats: true */
/*global level */
/*global ship */
/*global vector2d */

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

	var canvas, context2d, height, width;

	//declaration of function used later
	function clear() {
		context2d.clearRect(0, 0, width, height);
	}

	level.width = width = 600;
	level.height = height = 480;

	level.canvas = document.getElementById('background');
	level.loadLevel(1, function (json) {
		level.data = json.data;
		level.drawLevel(context2d);
	});

	ship.canvas = document.getElementById('game');
	ship.reset();
	ship.fuel = 1000;

	var line = Object.create(line2d);
	line.defineFromPoints({x:100, y:100}, {x:300, y:300});
	
	console.log(line);
	
	canvas = document.getElementById('game');
	canvas.width = width;
	canvas.height = height;
	context2d = canvas.getContext('2d');
	
	function gameLoop() {
		clear();
		ship.update();
		ship.draw();
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