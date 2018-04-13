"use strict";

let CONSTANTS = {
	GAME: {
		WIDTH: 1080,
		HEIGHT: 1920
	},
	STRINGS: {
		DEFAULT_TIMER: "000.000",
		TIMER_DESCRIPTION: "seconds elapsed"
	},
	BOARD: {
		ROWS: 8,
		COLS: 8,
		OFFSET: {
			LEFT: 60,
			TOP: 480
		},
		CELL: {
			HEIGHT: 120,
			WIDTH: 120
		},
		CELL_SPACING: 0
	},
	STATES: {
		BOOT: "boot",
		GAME_OVER: "gameOver",
		MENU: "menu",
		PLAY: "play",
		PRELOAD: "preload"
	}
};