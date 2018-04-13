"use strict";

var gameOver = function(game) {
	console.log("Preload screen");
};

gameOver.prototype = {
	preload: function() {
		console.log("Preload");
	},

	create: function() {
		console.log("Create");
	}
}