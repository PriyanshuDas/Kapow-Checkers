"use strict";

var player1Wins = function(game) {
};

play.prototype = {
    init: function(board) {
        this.board = board;
    },

    create: function() {
        this.drawBackground();
        this.drawBoard();
        this.game.add.image(200, 170, "win");
        this.game.add.image(300, 1600, "home");
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
                    if(this.board[i][j]===1) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-dark");
                    }
                    else if(this.board[i][j] === 10) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-dark-king");
                    }
                    if(this.board[i][j]===2) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-light");
                    }
                    else if(this.board[i][j] === 20) {
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