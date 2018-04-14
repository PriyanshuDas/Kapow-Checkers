"use strict";

var gameOver = function(game) {
	console.log("Preload screen");
};

gameOver.prototype = {

	init: function(board, winner) {
		this.board = JSON.parse(JSON.stringify(board));
		this.winner = winner;
	},

	preload: function() {
        this.boardOffsetTop = 490;
        this.boardOffsetLeft = 10;
        this.tileOffsetTop = 540;
        this.tileOffsetLeft = 60;
		console.log("Preload");
	},

	create: function() {
        this.game.sound.play("gameover-sound");
        console.log("Create");
		this.drawBackground();
		this.drawBoard();
		if(this.winner===1) {
            this.game.add.image(200, 170, "win");
        }
        else {
            this.game.add.image(200, 170, "lose");
        }
        var home = this.game.add.image(300, 1600, "home");
		home.inputEnabled = true;
        home.events.onInputDown.add(this.onHomeButtonClicked, this);
	},

    onHomeButtonClicked: function() {
        this.state.start("Menu", true);
	},

    drawBackground: function() {
        this.game.stage.backgroundColor = "#f4f2f5";
    },

    drawBoard: function() {

        var bg = this.game.add.image(this.boardOffsetLeft, this.boardOffsetTop, "board-background");

        var posTop = this.tileOffsetTop;
        var cnt = 0;
        for (var row = 0; row < CONSTANTS.BOARD.ROWS; row++) {
            var posLeft = this.tileOffsetLeft;
            for (var col = 0; col < CONSTANTS.BOARD.COLS; col++) {
                if((row+col)%2===1) {
                    var tile = this.game.add.image(posLeft, posTop, "cell");
                    //this.playableTiles[row+1][col+1].image = tile;
                    cnt++;
                    var checkerPiece = null;
                    if(this.board[row][col] === 1) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-dark");
                    }
                    else if(this.board[row][col] === 10) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-dark-king");
                    }
                    if(this.board[row][col]===2) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-light");
                    }
                    else if(this.board[row][col] === 20) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-light-king");
                    }
                }
                // this.addCellOnBoard(posLeft, posTop, this.prettify(this.firstFace[id], 2));
                posLeft += CONSTANTS.BOARD.CELL.WIDTH + CONSTANTS.BOARD.CELL_SPACING;
                // id += 1;
            }
            posTop += CONSTANTS.BOARD.CELL.HEIGHT + CONSTANTS.BOARD.CELL_SPACING;
        }
    }
}