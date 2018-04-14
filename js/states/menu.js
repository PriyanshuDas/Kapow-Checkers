"use strict";

var menu = function(game) {
	console.log("Preload screen");
};

menu.prototype = {
	preload: function() {
	},

	create: function() {
		this.game.add.image(0, 0, "background");
        this.game.add.button(80, 1200, "pass-and-play", this.onPassAndPlay, this, 0, 0, 1, 0);
        this.game.add.button(80, 1520, "practice", this.onPractice, this, 0, 0, 1, 0);
	},

	onPassAndPlay: function() {
		console.log("start game!");
		this.sound.mute = true;
        this.state.states["Play"].AI = 0;
		this.state.start("Play", true);
	},

	onPractice: function() {
        console.log("start game!");
        this.sound.mute = true;
        this.state.states["Play"].AI = 2;
        this.state.start("Play", true);
	}
}