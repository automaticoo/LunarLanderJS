Math.TAU = Math.PI * 2;
/*global Stats: true */
/*global level */
/*global ship */
/*global vector2d */
/*global starfield */
/*global Worker */

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

	var canvas, context2d, worker, GameStates, currentState;

	GameStates = {
		RESTART_GAME : 0,
		START_GAME : 1,
		NEXT_LEVEL : 2,
		UPDATE_LEVEL : 3
	};
	
	//initialize collision worker
	worker = new Worker("js/CollisionWorker.js");
	worker.addEventListener('message', function (event) {
		var message;
		message = JSON.parse(event.data);
		if (message.type === "collision") {
			//collision on points message.data
			console.log("col");
		}
	});
	
	//initialize canvas
	canvas = document.getElementById('game');
	canvas.width = 600;
	canvas.height = 480;
	context2d = canvas.getContext('2d');
	
	//initialize ship
	ship.sound = document.getElementById('thruster');
	ship.canvas = document.getElementById('game');
	ship.reset();
	ship.fuel = 1000000;
	
	shipController.init();
	console.log(shipController);
	
	//initialize level
	level.canvas = document.getElementById('background');
	level.loadLevel(0, function () {
		worker.postMessage(JSON.stringify({type: "LinesUpdate", data: level.lines}));
	});

	//initialize starfield
	starfield.createStars(2000);

	function gameLoop() {
        context2d.clearRect(0, 0, 600, 480);

		level.draw();

		starfield.update();
		starfield.draw(context2d);
		
		shipController.update(ship);
		
		ship.update();
		ship.draw(context2d);

		context2d.textAlign = 'center';
		context2d.fillStyle = '#fff';
		context2d.font = "20pt Vectorb";
		context2d.fillText("PRESS A KEY TO PLAY", 600 / 2, 480 / 2);

		worker.postMessage(JSON.stringify({type: "ShipUpdate", data: ship.circle}));
	}
	
	setInterval(gameLoop, 1000 / 60);

	gameLoop();
};