/*global vector2d */
/*global line2d */

var level = Object.create({}, {
	x : {
		set: function (value) {
			"use strict";
			this.localX = value;
			this.update = true;
		}
	},
	y : {
		set: function (value) {
			"use strict";
			this.localY = value;
			this.update = true;
		}
	},
	update : {
		value: true,
		writable: true,
		enumarable: true
	},
	data : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	lines : {
		value: [],
		writable: true,
		enumarable: true
	},
	onLineChange : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	canvas : {
		set:  function (value) {
			"use strict";
			this.context2d = value.getContext('2d');

			value.width = 600;
			value.height = 480;
		}
	},
	loadLevel : {
		value: function (number, callback) {
			"use strict";
			var json, request;

			this.data = undefined;
			this.lines = [];
			this.x = 0;

			request = new XMLHttpRequest();
			request.parent = this;
			request.open("GET", "data/level" + number + ".json", true);
			request.onreadystatechange = function () {
				var prependArray, appendArray, i, line;

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

					for (i = 0; i < json.data.points.length - 1; i += 1) {
						line = Object.create(line2d);
						line.defineFromPoints(json.data.points[i + 1], json.data.points[i]);
						line.color = 'black';
						this.parent.lines.push(line);
					}
					this.parent.data = json.data;
					callback();
				}
			};
			request.send(null);
		},
		enumarable: true
	},
	draw : {
		value: function () {
			"use strict";
			var i;
			if (!this.context2d) {
				console.log("first set canvas before drawing");
			}
			if (this.lines.length > 0) {
				this.context2d.clearRect(0, 0, 600, 480);
				for (i = 0; i < this.lines.length; i += 1) {
					this.lines[i].lineWidth = 2;
					this.lines[i].draw(this.context2d);
				}
				this.update = false;

				this.context2d.fillStyle = "black";
				this.context2d.strokeStyle = "white";
				this.context2d.lineWidth = 1;
				this.context2d.beginPath();
				this.context2d.moveTo(this.data.points[0].x, 480);
				for (i = 0; i < this.data.points.length; i += 1) {
					this.context2d.lineTo(this.data.points[i].x + this.localX, this.data.points[i].y);
				}
				this.context2d.lineTo(this.data.points[this.data.points.length - 1].x, 480);
				this.context2d.fill();
				this.context2d.stroke();
				this.context2d.closePath();
			}
		}
	}
});