"use strict";

var preload = function(game) {
};

preload.prototype = {
	preload: function() {
        this.game.load.image('cell', 'assets/images/tile-black.png');
        this.game.load.image('board-background', 'assets/images/board-background.png');
        this.game.load.image("background", "assets/images/background.png");
        this.game.load.image("playButton", "assets/images/vs-friend.png");
        this.game.load.image("checker-dark", "assets/images/checker-dark.png");
        this.game.load.image("checker-dark-selected", "assets/images/checker-dark-selected.png");
        this.game.load.image("checker-dark-king", "assets/images/checker-dark-king.png");
        this.game.load.image("checker-dark-king-selected", "assets/images/checker-dark-king-selected.png");
        this.game.load.image("checker-dark-place", "assets/images/checker-dark-place.png");
        this.game.load.image("checker-light", "assets/images/checker-light.png");
        this.game.load.image("checker-light-selected", "assets/images/checker-light-selected.png");
        this.game.load.image("checker-light-king", "assets/images/checker-light-king.png");
        this.game.load.image("checker-light-king-selected", "assets/images/checker-light-king-selected.png");
        this.game.load.image("checker-light-place", "assets/images/checker-light-place.png");
        this.game.load.image("lavaflow", "assets/images/lavaflow.png");
	},

	create: function() {
		this.state.start("Menu", true);
	}
}