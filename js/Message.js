var message = Object.create({}, {
	text : {
		set : function (value) {
			"use strict";
			var lines = value.split("\n");
			this.head = lines[0];
			this.subHead = lines.slice(1);
		}
	},
	head : {
		value: "",
		enumarable: true,
		writable: true
	},
	subHead: {
		value: [],
		enumarable: true,
		writable: true
	},
	draw : {
		value: function (context2d) {
			"use strict";
			var i;
			if (this.head !== "") {
				context2d.textAlign = 'center';
				context2d.fillStyle = '#fff';
				context2d.font = "20pt Vectorb";
				context2d.fillText(this.head, 300, 160);
				context2d.font = "10pt Vectorb";
				for (i = 0; i < this.subHead.length; i += 1) {
					context2d.fillText(this.subHead[i], 300, 180 + i * 20);
				}
			}
		}
	}
});