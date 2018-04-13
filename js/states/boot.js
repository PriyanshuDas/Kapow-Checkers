"use strict";

var boot = function(game) {
};

boot.prototype = {
	preload: function() {
	},

	create: function() {
		this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.input.maxPointers = 2;
        this.state.start('Preload', true);
	}
}