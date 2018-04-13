"use strict";

(function() {
	var game = new Phaser.Game(CONSTANTS.GAME.WIDTH, CONSTANTS.GAME.HEIGHT, Phaser.AUTO, 'fastest-fifty-first');

	game.state.add("Boot", boot);
	game.state.add("Preload", preload);
	game.state.add("Menu", menu);
	game.state.add("Play", play);
	game.state.add("GameOver", gameOver);
	game.state.start("Boot");

}());