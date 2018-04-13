"use strict";

var menu = function(game) {
	console.log("Preload screen");
};

menu.prototype = {
	preload: function() {
	},

	create: function() {
		this.game.add.image(0, 0, "background");
        let tempCell = this.game.add.button(80, 1360, "playButton", this.onClick, this, 0, 0, 1, 0);
	},

	onClick: function() {
		console.log("start game!");
		this.state.start("Play", true);
	}
}