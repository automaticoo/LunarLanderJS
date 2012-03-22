var THRUST_CONSTANT = 0.0015;
var DRAG = 0.999;

var ship = Object.create({}, {
	position : {
		value: {x: 0, y: 0},
		writable: true,
		enumarable: true
	},
	velocity : {
		value: {x: 0, y: 0},
		writable: true,
		enumarable: true
	},
	gravity : {
		value: 0.0005,
		writable: true,
		enumarable: true
	},
	rotation : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	canvas : {
		set:  function (value) {
			"use strict";
			this.context2d = value.getContext('2d');
		}
	},
	thrust : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	fuel : {
		value: undefined,
		writable: true,
		enumarable: true
	},
	draw : {
		value: function () {
			"use strict";

			this.context2d.save();
			this.context2d.translate(this.position.x, this.position.y);
			this.context2d.rotate(this.rotation);
			this.context2d.strokeStyle = "white";
			this.context2d.beginPath();

			//circle
			this.context2d.arc(0, 0, 4, 0, Math.TAU, true);

			//right diagonal line
			this.context2d.moveTo(2, 2);
			this.context2d.lineTo(4, 5);

			//left diagonal line
			this.context2d.moveTo(-2, 2);
			this.context2d.lineTo(-4, 5);

			//middle line
			this.context2d.moveTo(-3.2, 4);
			this.context2d.lineTo(3.2, 4);

			//thrust triangle
			this.context2d.moveTo(-2, 5);
			this.context2d.lineTo(0, this.thrust * 20 + 5);
			this.context2d.lineTo(2, 5);

			this.context2d.stroke();
			this.context2d.closePath();

			this.context2d.restore();
		}
	},
	update : {
		value: function () {
			"use strict";

			//update velocity
			if (this.thrust > 0) {
				this.velocity.x += (this.thrust * THRUST_CONSTANT) * Math.sin(this.rotation);
				this.velocity.y -= (this.thrust * THRUST_CONSTANT) * Math.cos(this.rotation);
			}
			this.velocity.y += this.gravity;
			this.velocity.x *= DRAG;

			//update fuel
			if (this.fuel <= 0 && this.thrust !== 0) {
				if (this.thrust > 0) {
					this.thrust -= 0.05;
				}
				if (this.thrust < 0.05) {
					this.thrust = 0;
				}
			} else {
				this.fuel -= this.thrust * 0.2;
			}
			
			//update position
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		}
	},
	reset : {
		value: function () {
			"use strict";
			this.position.x = 200;
			this.position.y = 100;
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.rotation = 0;
			this.thrust = 1;
		}
	}
});