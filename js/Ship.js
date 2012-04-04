/*global vector2d */
/*global circle2d */

var THRUST_CONSTANT = 0.0015;
var DRAG = 0.999;

var ship = Object.create({}, {
	position : {
		value: Object.create(vector2d),
		writable: true,
		enumarable: true
	},
	circle : {
		value: Object.create(circle2d),
		writable: true,
		enumarable: true
	},
	velocity : {
		value: Object.create(vector2d),
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
    sound : {
      set: function (value) {
          "use strict";
          this.localSound = value;
          this.localSound.play();
          this.localSound.volume = 0;
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
		value: function (context2d) {
			"use strict";
			context2d.save();
			context2d.translate(this.position.x, this.position.y);
			context2d.rotate(this.rotation);
			context2d.strokeStyle = "white";
			context2d.beginPath();

			//circle
			context2d.arc(0, 0, 4, 0, Math.TAU, true);

			//right diagonal line
			context2d.moveTo(2, 2);
			context2d.lineTo(4, 5);

			//left diagonal line
			context2d.moveTo(-2, 2);
			context2d.lineTo(-4, 5);

			//middle line
			context2d.moveTo(-3.2, 4);
			context2d.lineTo(3.2, 4);

			//thrust triangle
			context2d.moveTo(-2, 5);
			context2d.lineTo(0, this.thrust * 20 + 5);
			context2d.lineTo(2, 5);

			context2d.stroke();
			context2d.closePath();

			context2d.restore();
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

            //this.localSound.volume = this.thrust;

			//update position			
			this.position.add(this.velocity);

			this.circle.y = this.position.y;
			this.circle.x = this.position.x;
		}
	},
	reset : {
		value: function () {
			"use strict";
			this.position.x = 200;
			this.position.y = 400;
			this.velocity.x = 0;
			this.velocity.y = 0;
			this.rotation = 0;
			this.thrust = 1;
			this.circle.radius = 6;
		}
	}
});