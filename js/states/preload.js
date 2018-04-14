"use strict";

var preload = function(game) {
};

preload.prototype = {
	preload: function() {
        console.log("Preloading Preload State");
        this.loadingComplete = false;
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.add.text(0, 0, "fontFix", {font: "1px nunito-regular", fill: "#000000"});
        this._createLoader();
        this.load.onLoadComplete.addOnce(this._onLoadComplete, this);
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
        this.game.load.image("player-1-kills", "assets/images/player-1-kills.png");
        this.game.load.image("player-2-kills", "assets/images/player-2-kills.png");
        this.game.load.image("win", "assets/images/win.png");
        this.game.load.image("lose", "assets/images/lose.png");
        this.game.load.image("home", "assets/images/home.png");
        this.game.load.image("turn", "assets/images/turn.png");
        this.game.load.image("back", "assets/images/back.png");
        this.game.load.audio("game-audio", "assets/audio/game-audio.mp3");
        this.game.load.audio("move-sound", "assets/audio/move-sound.wav");
	},

    _createLoader() {
        this.progressBar = this.game.add.sprite(this.world.centerX - 360, this.world.centerY, "progressBar");
        this.progressBar.anchor.setTo(0, 0.5);
        this.game.stage.addChild(this.progressBar);
        this.load.setPreloadSprite(this.progressBar);

        this.progressBackground = this.add.sprite(this.world.centerX, this.world.centerY, "progressBackground");
        this.progressBackground.anchor.setTo(0.5, 0.5);
        this.game.stage.addChild(this.progressBackground);
    },

    _onLoadComplete() {
        this.sound = this.game.add.audio('game-audio');
        this.game.sound.setDecodedCallback([this.sound], this._start, this);
    },

    _start() {
        this.sound.play();
        this.sound.mute = false;
        this.sound.loop = true;
        this.sound.loopFull(0.2);
        this.loadingComplete = true;
    },

    update() {
        if(this.loadingComplete) {
            console.log("Loading Complete");
            this.progressBackground.destroy();
            this.progressBar.destroy();
            this.loadingComplete = false;
            this.state.start("Menu", true, this.moveAudio);
        }
    }

	// create: function() {
	// 	this.state.start("Menu", true);
	// }
}