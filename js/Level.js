var level = Object.create({}, {
	width : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	height : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	x : {
		set: function (value) {
			"use strict";
			this.localX = value;
			this.drawLevel();
		},
		get: function () {
			"use strict";
			return this.localX;
		}
	},
	data : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	canvas : {
		set:  function (value) {
			"use strict";
			this.context2d = value.getContext('2d');

			value.width = this.width;
			value.height = this.height;
		}
	},
	loadLevel : {
		value: function (number, onComplete) {
			"use strict";
			var json, request;

			this.data = undefined;
			this.x = 0;

			request = new XMLHttpRequest();
			request.open("GET", "data/level" + number + ".json", false);
			request.onreadystatechange = function () {
				var prependArray, appendArray, i;

				if (request.readyState === 4) { //&& request.status === 200
					json = JSON.parse(request.responseText);

					prependArray = json.data.points.slice(0, json.data.points.length);
					for (i = 0; i < prependArray.length; i += 1) {
						prependArray[i] = {x: prependArray[i].x, y: prependArray[i].y};
						prependArray[i].x = -prependArray[i].x - 5;
					}

					appendArray = json.data.points.slice(0, json.data.points.length);
					for (i = 0; i < prependArray.length; i += 1) {
						appendArray[i] = {x: appendArray[i].x, y: appendArray[i].y};
						appendArray[i].x = (605 - appendArray[i].x) + 605;
					}

					json.data.points.reverse();
					json.data.points = json.data.points.concat(prependArray);
					json.data.points.reverse();

					appendArray.reverse();
					json.data.points = json.data.points.concat(appendArray);

					onComplete(json);
				}
			};
			request.send(null);
		},
		enumarable: true
	},
	drawLevel : {
		value: function () {
			"use strict";
			var i;
			if (!this.context2d) {
				console.log("first set canvas before drawing");
			}
			if (this.data !== undefined) {
				this.context2d.clearRect(0, 0, this.width, this.height);
				this.context2d.fillStyle = "black";
				this.context2d.strokeStyle = "white";
				this.context2d.beginPath();
				this.context2d.moveTo(this.data.points[0].x, this.height);
				for (i = 0; i < this.data.points.length; i += 1) {
					this.context2d.lineTo(this.data.points[i].x + this.localX, this.data.points[i].y);
				}
				this.context2d.lineTo(this.data.points[this.data.points.length - 1].x, this.height);
				this.context2d.fill();
				this.context2d.stroke();
				this.context2d.closePath();
			}
		}
	}
});