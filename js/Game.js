/*global Stats: true */
/*global level */
/*global ship */
/*global shipController */
/*global vector2d */
/*global starfield */
/*global message */
/*global Worker */
/*global requestAnimationFrame */

window.onload = function main() {
	"use strict";

	var canvas, context2d, worker, GameStates, currentState, currentLevel;

	GameStates = {
		RESTART_GAME : 0,
		START_GAME : 1,
		NEXT_LEVEL : 2,
		UPDATE_LEVEL : 3
	};

	currentState = GameStates.START_GAME;
	currentLevel = 0;


	//initialize collision worker
	worker = new Worker("js/CollisionWorker.js");
	worker.addEventListener('message', function (event) {
		var message;
		message = JSON.parse(event.data);
		if (message.type === "collision" && currentState !== GameStates.RESTART_GAME && currentState !== GameStates.START_GAME) {
			//collision on points message.data
			worker.postMessage(JSON.stringify({type: "StopUpdate"}));
			currentState = GameStates.RESTART_GAME;
		}
	});

	level.canvas = document.getElementById('background');
	level.loadLevel(currentLevel, function () {
		worker.postMessage(JSON.stringify({type: "LinesUpdate", data: level.lines}));
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

	shipController.init();

	//initialize starfield
	starfield.createStars(2000);

	message.text = "PRESS A KEY TO PLAY\nSPACE FOR ONE TIME BOOSTER\nARROW KEYS TO MOVE";

	
	
	function gameLoop() {
		starfield.update();
		if (currentState === GameStates.UPDATE_LEVEL) {
			console.log(ship.position.y);
			shipController.update(ship);
			ship.update();
		} else if (currentState === GameStates.RESTART_GAME) {
			ship.reset();
			message.text = "GAME OVER\nPRESS A KEY TO PLAY\nSPACE FOR ONE TIME BOOSTER\nARROW KEYS TO MOVE";
			currentState = GameStates.START_GAME;
		}
		worker.postMessage(JSON.stringify({type: "ShipUpdate", data: ship.circle}));
	}

	function draw() {
		context2d.clearRect(0, 0, 600, 480);
		level.draw();
		starfield.draw(context2d);
		ship.draw(context2d);
		message.draw(context2d);
		requestAnimationFrame(draw);
	}

	setInterval(gameLoop, 1000 / 60);
	requestAnimationFrame(draw);

	function nextLevel() {
		currentLevel += 1;
		level.loadLevel(currentLevel, function () {
			worker.postMessage(JSON.stringify({type: "LinesUpdate", data: level.lines}));
			currentState = GameStates.START_GAME;
		});
	}
	function startLevel() {
		message.text = "";
		currentState = GameStates.UPDATE_LEVEL;
		
		level.loadLevel(currentLevel, function () {
			worker.postMessage(JSON.stringify({type: "LinesUpdate", data: level.lines}));
		});
	}

	document.addEventListener("keydown", function () {
		if (currentState === GameStates.START_GAME) {
			startLevel();
		} else if (currentState === GameStates.NEXT_LEVEL) {
			nextLevel();
		}
	}, false);
};