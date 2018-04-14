"use strict";

var play = function(game) {
};

play.prototype = {

	preload: function() {
	    this.moveSound = this.game.add.audio("move-sound");
		console.log("Play!");
	},

	create: function() {
        this.drawBackground();
        this.turn = this.game.add.image(370, 15, "turn");
	    var back = this.game.add.image(40, 20, "back");
        back.inputEnabled = true;
        back.events.onInputDown.add(this.onBackButton, this);
	    this.turnIcon = null;
	    this.boardOffsetTop = 490;
	    this.boardOffsetLeft = 10;
	    this.tileOffsetTop = 540;
	    this.tileOffsetLeft = 60;
		this.redrawBoard = false;
	    this.init();
		this.player = 2;
        this.drawBoard();
	},

    onBackButton: function() {
	    this.state.start("Menu");
    },

	init: function() {
		this.hasGameStarted = false;
	},

	update: function() {
		if (this.hasGameStarted == true) {
			this.updateTimer();
		}
		if(this.redrawBoard) {
            for(var i=0; i<this.player1KillCounter; i++) {
                if(this.player1Kills[Math.floor(i/6)][i%6]) {
                    var temp = this.player1Kills[Math.floor(i / 6)][i % 6].number;
                    this.player1Kills[Math.floor(i / 6)][i % 6].image && this.player1Kills[Math.floor(i / 6)][i % 6].image.destroy();
                }
                switch(temp) {
                    case 222:
                    case 2:
                        var piece = this.game.add.image(60+(i%6)*120, 1620+(Math.floor(i/6))*120, "checker-light");
                        this.player1Kills[Math.floor(i/6)][i%6].image = piece;
                        break;
                    case 2222:
                    case 20:
                        var piece = this.game.add.image(60+(i%6)*120, 1620+(Math.floor(i/6))*120, "checker-light-king");
                        this.player1Kills[Math.floor(i/6)][i%6].image = piece;
                        break;
                }
            }
            for(var i=0; i<this.player2KillCounter; i++) {
                if(this.player2Kills[Math.floor(i/6)][i%6]) {
                    var temp = this.player2Kills[Math.floor(i / 6)][i % 6].number;
                    this.player2Kills[Math.floor(i / 6)][i % 6].image && this.player2Kills[Math.floor(i / 6)][i % 6].image.destroy();
                }
                switch(temp) {
                    case 111:
                    case 1:
                        var piece = this.game.add.image(300+(i%6)*120, 190+(Math.floor(i/6))*120, "checker-dark");
                        this.player2Kills[Math.floor(i/6)][i%6].image = piece;
                        break;
                    case 1111:
                    case 10:
                        var piece = this.game.add.image(300+(i%6)*120, 190+(Math.floor(i/6))*120, "checker-dark-king");
                        this.player2Kills[Math.floor(i/6)][i%6].image = piece;
                        break;
                }
            }
		    for(var i=0; i<8; i++) {
		        for(var j=0; j<8; j++) {
		            switch(this.board[i][j]) {
                        case 111:
                        case 1: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                                var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-dark");
                                this.checkerBoard[i][j] = piece;
                            break;
                        case 1111:
                        case 10: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-dark-king");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 11101:
                        case 11: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-dark-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 111101:
                        case 101: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-dark-king-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 222:
                        case 2: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-light");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 2222:
                        case 20: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-light-king");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 22201:
                        case 21: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-light-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 222201:
                        case 201: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-light-king-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case -1: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece;
                            if(this.player === 1)
                                piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-dark-place");
                            else
                                piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-light-place");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case -2: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece;
                            if(this.player === 1)
                                piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-dark-place");
                            else
                                piece = this.game.add.image(this.tileOffsetLeft+j*120, this.tileOffsetTop+i*120, "checker-light-place");
                            this.checkerBoard[i][j] = piece;
                            break;
                        default: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            break;
                    }
                }
            }
            this.redrawBoard = false;
        }
	},

	drawBackground: function() {
		this.game.stage.backgroundColor = "#f4f2f5";
		this.kills2 = this.game.add.image(280, 170, "player-2-kills");
        this.kills1 = this.game.add.image(40, 1600, "player-1-kills-active");
	},

	drawBoard: function() {

	    this.boardState = "none";   // boardState: none, highlighted

		var bg = this.game.add.image(this.boardOffsetLeft, this.boardOffsetTop, "board-background");
        bg.inputEnabled = true;
        bg.input.priorityID = 0;
        bg.events.onInputDown.add(this.onBackgroundClicked, this);

        this.board = [];
		this.currentPath = [];
		this.path = [];
		this.checkerBoard = [];
		this.player1Kills = [];
		this.player2Kills = [];
		this.player1KillCounter = 0;
		this.player2KillCounter = 0;

		for(var i=0; i<2; i++) {
		    this.player1Kills[i] = [];
		    this.player2Kills[i] = [];
		    for(var j=0; j<6; j++) {
		        this.player1Kills[i][j] = {};
		        this.player2Kills[i][j] = {};
            }
        }

		for(var i=0; i<8; i++) {
		    this.board[i] = [];
		    this.path[i] = [];
		    this.checkerBoard[i] = [];
        }

        // Got a 8x8 board and will use this to maintain state of the game.
        // 1: player 1
        // 2: player 2
        // 10: player 1 king
        // 20: player 2 king
        // 11: player 1 selected
        // 21: player 2 selected
        // 101: player 1 king selected
        // 201: player 2 king selected
        // -1: highlighted
        // -2: capture highlighted
        // 0: nothing
        // 222: player 2 piece can't move
        // 2222: player 2 king piece can't move
        // 111: player 1 piece can't move
        // 1111: player 1 king piece can't move

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
                    if(cnt>=1 && cnt<=12) {
                        this.board[row][col] = 2;
                        //var curTile = this.playableTiles[row+1][col+1];
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-light");
                        this.checkerBoard[row][col] = checkerPiece;
                        //curTile.occupiedBy.image = checkerPiece;
                    }
					else if(cnt>=21 && cnt<=32) {
                        this.board[row][col] = 1;
                        //var curTile = this.playableTiles[row+1][col+1];
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-dark");
                        this.checkerBoard[row][col] = checkerPiece;
                        //curTile.occupiedBy.image = checkerPiece;
					}
                    tile.inputEnabled = true;
                    tile.input.priorityID = 2;
                    tile.events.onInputDown.add(this.onPieceSelected, this);
                }
				// this.addCellOnBoard(posLeft, posTop, this.prettify(this.firstFace[id], 2));
				 posLeft += CONSTANTS.BOARD.CELL.WIDTH + CONSTANTS.BOARD.CELL_SPACING;
				// id += 1;
			}
			posTop += CONSTANTS.BOARD.CELL.HEIGHT + CONSTANTS.BOARD.CELL_SPACING;
		}
		this.changePlayer();
	},

    clearHighlightedMoves: function() {
	    for(var i=0; i<8; i++) {
	        for(var j=0; j<8; j++) {
	            if(this.board[i][j] === -1 || this.board[i][j] === -2) {
	                this.board[i][j] = 0;
                }
            }
        }
    },

    selectRandom: function(l) {
        return Math.floor(Math.random()*l);
    },

    makeAImove: function() {
        var that = this;
        var validSelections = [];
        for(var i = 0; i < 8; i++) {
            for(var j = 0; j < 8; j++) {
                if(that.board[i][j] === that.AI || that.board[i][j] === 10*that.AI) {
                    validSelections.push({x: JSON.parse(JSON.stringify(i)), y: JSON.parse(JSON.stringify(j)) });
                }
            }
        }
        var selectedItem = validSelections[that.selectRandom(validSelections.length)];
        setTimeout(function() {
            that.handleInput(selectedItem.x, selectedItem.y);
            var validMoves = [];
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    if (that.board[i][j] < 0) {
                        validMoves.push({x: JSON.parse(JSON.stringify(i)), y: JSON.parse(JSON.stringify(j))});
                    }
                }
            }
            var selectedPosition = validMoves[that.selectRandom(validMoves.length)];
            setTimeout(function() {
                that.handleInput(selectedPosition.x, selectedPosition.y);
            }.bind(this), 200);
        }.bind(this), 200);
    },

    resetBoard: function() {
	    for(var i=0; i<8; i++) {
	        for(var j=0; j<8; j++) {
	            if(this.board[i][j] === 111) this.board[i][j] = 1;
	            else if(this.board[i][j] === 1111) this.board[i][j] = 10;
	            else if(this.board[i][j] === 222) this.board[i][j] = 2;
	            else if(this.board[i][j] === 2222) this.board[i][j] = 20;
            }
        }
    },

    changePlayer: function() {
	    this.resetBoard();
	    if(this.player===1) {
            this.turnIcon && this.turnIcon.destroy();
            this.turnIcon = this.game.add.image(395, 25, "checker-light");
	        this.player = 2;
	        var forced = false;
	        for(var i=0; i<8; i++) {
	            for(var j=0; j<8; j++) {
	                if(this.board[i][j] === 2 || this.board[i][j] === 20) { // player 2's piece or king piece
	                    this.moves = [];
	                    this._highlightAvailableMoves(i, j, this.board[i][j], 2, true);
	                    this.clearHighlightedMoves();
	                    if(this.moves.length) {
	                        forced = true;
	                        if(this.board[i][j] === 2) this.board[i][j] = 222;
	                        else if(this.board[i][j] === 20) this.board[i][j] = 2222;
                        }
                    }
                }
            }
            if(forced) {
	            for(var i=0; i<8; i++) {
	                for(var j=0; j<8; j++) {
	                    if(this.board[i][j] === 2) {
	                        this.board[i][j] = 222;
                        }
                        else if(this.board[i][j] === 20) {
	                        this.board[i][j] = 2222;
                        }
                        else if(this.board[i][j] === 222) {
	                        this.board[i][j] = 2;
                        }
                        else if(this.board[i][j] === 2222) {
	                        this.board[i][j] = 20;
                        }
                    }
                }
            }
            else {
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        if(this.board[i][j] === 2 || this.board[i][j] === 20) { // player 2's piece or king piece
                            this.moves = [];
                            this._highlightAvailableMoves(i, j, this.board[i][j], 2);
                            this.clearHighlightedMoves();
                            if(!this.moves.length) {
                                if(this.board[i][j] === 2) this.board[i][j] = 222;
                                else if(this.board[i][j] === 20) this.board[i][j] = 2222;
                            }
                        }
                    }
                }
            }
            for(var i=0; i<8; i++) {
	            for(var j=0; j<8; j++) {
	                if(this.board[i][j] === -1 || this.board[i][j] === -2) {
	                    this.board[i][j] = 0;
                    }
                    else if(this.board[i][j] === 111) {
	                    this.board[i][j] = 1;
                    }
                    else if(this.board[i][j] === 1111) {
	                    this.board[i][j] = 10;
                    }
                }
            }
        }
        else {
            this.turnIcon && this.turnIcon.destroy();
            this.turnIcon = this.game.add.image(395, 25, "checker-dark");
            this.player = 1;
            var forced = false;
            for(var i=0; i<8; i++) {
                for(var j=0; j<8; j++) {
                    if(this.board[i][j] === 1 || this.board[i][j] === 10) { // player 1's piece or king piece
                        this.moves = [];
                        this._highlightAvailableMoves(i, j, this.board[i][j], 1, true);
                        this.clearHighlightedMoves();
                        if(this.moves.length) {
                            forced = true;
                            if(this.board[i][j] === 1) this.board[i][j] = 111;
                            else if(this.board[i][j] === 10) this.board[i][j] = 1111;
                        }
                    }
                }
            }
            if(forced) {
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        if(this.board[i][j] === 1) {
                            this.board[i][j] = 111;
                        }
                        else if(this.board[i][j] === 10) {
                            this.board[i][j] = 1111;
                        }
                        else if(this.board[i][j] === 111) {
                            this.board[i][j] = 1;
                        }
                        else if(this.board[i][j] === 1111) {
                            this.board[i][j] = 10;
                        }
                    }
                }
            }

            else {
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        if(this.board[i][j] === 1 || this.board[i][j] === 10) { // player 1's piece or king piece
                            this.moves = [];
                            this._highlightAvailableMoves(i, j, this.board[i][j], 1);
                            this.clearHighlightedMoves();
                            if(!this.moves.length) {
                                if(this.board[i][j] === 1) this.board[i][j] = 111;
                                else if(this.board[i][j] === 10) this.board[i][j] = 1111;
                            }
                        }
                    }
                }
            }
            for(var i=0; i<8; i++) {
                for(var j=0; j<8; j++) {
                    if(this.board[i][j] === -1 || this.board[i][j] === -2) {
                        this.board[i][j] = 0;
                    }
                    else if(this.board[i][j] === 222) {
                        this.board[i][j] = 2;
                    }
                    else if(this.board[i][j] === 2222) {
                        this.board[i][j] = 20;
                    }
                }
            }
        }
        if(this.checkGameOver()) {
	        if(this.player === 1) {
                this.state.start("GameOver", true, false, this.board, 2);
            }
            else {
	            this.state.start("GameOver", true, false, this.board, 1);
            }
        }
        else if (this.player === this.AI)
            this.makeAImove();
    },

    checkGameOver: function() {
	    if(this.player1KillCounter === 12 || this.player2KillCounter === 12) {
	        return true;
        }
        var ret = true;
        if(this.player === 1) {
	        for(var i=0; i<8; i++) {
	            for(var j=0; j<8; j++) {
	                if(this.board[i][j]===1 || this.board[i][j]===10) {
	                    this.moves = [];
	                    this._highlightAvailableMoves(i,j, this.board[i][j], this.player, false);
	                    if(this.moves.length) {
	                        ret = false;
                        }
                        this.clearHighlightedMoves();
                    }
                }
            }
        }
        else {
            for(var i=0; i<8; i++) {
                for(var j=0; j<8; j++) {
                    if(this.board[i][j]===2 || this.board[i][j]===20) {
                        this.moves = [];
                        this._highlightAvailableMoves(i,j, this.board[i][j], this.player, false);
                        if(this.moves.length) {
                            ret = false;
                        }
                        this.clearHighlightedMoves();
                    }
                }
            }
        }
        return ret;
    },

    onBackgroundClicked: function(e) {
	    this.handleInput(0,0);
    },

	onPieceSelected: function(e) {
		//console.log(e);
		var x, y;
		var left = e.position.x;
		var top = e.position.y;
		y = (left-this.tileOffsetLeft)/120;
		x = (top-this.tileOffsetTop)/120;
		console.log(x, y);
		this.handleInput(x, y);
	},

    handleInput: function(x, y) {
        if(this.boardState === "none") {
            if(this.player === 1) {
                if(this.board[x][y] === 1 || this.board[x][y] === 10) { // If player 1's piece, or player 1's king piece
                    this.board[x][y] = this.board[x][y]*10 + 1; // Make the piece selected.
                    this._highlightAvailableMoves(x, y, this.board[x][y], 1);
                    this.boardState = "selected";
                    console.log(this.board);
                }
                else if(this.board[x][y] === 111) {
                    this.board[x][y] = 11101;
                    this.boardState = "selected";
                    console.log(this.board);
                }
                else if(this.board[x][y] === 1111) {
                    this.board[x][y] = 111101;
                    this.boardState = "selected";
                    console.log(this.board);
                }
            }
            else {
                if(this.board[x][y] === 2 || this.board[x][y] === 20) { // If player 2's piece, or player 2's king piece
                    this.board[x][y] = this.board[x][y]*10 + 1; // Make the piece selected.
                    this._highlightAvailableMoves(x, y, this.board[x][y], 2);
                    this.boardState = "selected";
                    console.log(this.board);
                }
                else if(this.board[x][y] === 222) {
                    this.board[x][y] = 22201;
                    this.boardState = "selected";
                    console.log(this.board);
                }
                else if(this.board[x][y] === 2222) {
                    this.board[x][y] = 222201;
                    this.boardState = "selected";
                    console.log(this.board);
                }
            }
        }

        else if(this.boardState === "selected") {
            if(this.board[x][y]===-1) {
                var piece;
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        if(this.board[i][j]===-1 || this.board[i][j]===-2) {
                            this.board[i][j] = 0;
                        }
                        else {
                            if(this.board[i][j]===11 || this.board[i][j]===101 || this.board[i][j]===21 || this.board[i][j]===201) {
                                piece = (this.board[i][j]-1)/10;
                                this.board[i][j] = 0;
                            }
                        }
                    }
                }
                this.board[x][y] = piece;
                for(var j=0; j<8; j++) {
                    if(this.board[0][j]===1) {
                        this.board[0][j] = 10;
                    }
                }
                for(var j=0; j<8; j++) {
                    if(this.board[7][j]===2) {
                        this.board[7][j] = 20;
                    }
                }
                if(this.player === 1) {
                    this.kills1 && this.kills1.destroy();
                    this.kills1 = this.game.add.image(40, 1600, "player-1-kills")
                    this.kills2 && this.kills2.destroy();
                    this.kills2 = this.game.add.image(280, 170, "player-2-kills-active");
                }
                else {
                    this.kills2 && this.kills1.destroy();
                    this.kills2 = this.game.add.image(280, 170, "player-2-kills")
                    this.kills1 && this.kills1.destroy();
                    this.kills1 = this.game.add.image(40, 1600, "player-1-kills-active");
                }
                this.boardState = "none";
                this.redrawBoard = true;
                this.moveSound.play();
                this.changePlayer();
            }
            else if(this.board[x][y]===-2) {
                var sx,sy;
                var piece;
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        var temp = this.board[i][j];
                        if(temp===11 || temp===101 || temp===21 || temp===201) {
                            sx = i;
                            sy = j;
                            piece = temp;
                        }
                    }
                }
                this.path[x][y].push({x: x, y: y});
                for(var i=1; i<this.path[x][y].length; i++) {
                    var targetX = this.path[x][y][i].x;
                    var targetY = this.path[x][y][i].y;
                    var dirX = targetX - sx;
                    var dirY = targetY - sy;
                    var midX = dirX/2;
                    var midY = dirY/2;
                    if(this.player === 1) {
                        this.player1Kills[Math.floor(this.player1KillCounter/6)][this.player1KillCounter%6].number = this.board[sx+midX][sy+midY];
                        this.player1KillCounter++;
                    }
                    else {
                        this.player2Kills[Math.floor(this.player2KillCounter/6)][this.player2KillCounter%6].number = this.board[sx+midX][sy+midY];
                        this.player2KillCounter++;
                    }
                    //this.capture(sx + midX, sy+midY);

                    if(this.player === 1) {
                        this.kills1 && this.kills1.destroy();
                        this.kills1 = this.game.add.image(40, 1600, "player-1-kills")
                        this.kills2 && this.kills2.destroy();
                        this.kills2 = this.game.add.image(280, 170, "player-2-kills-active");
                    }
                    else {
                        this.kills2 && this.kills1.destroy();
                        this.kills2 = this.game.add.image(280, 170, "player-2-kills")
                        this.kills1 && this.kills1.destroy();
                        this.kills1 = this.game.add.image(40, 1600, "player-1-kills-active");
                    }
                    this.board[sx+midX][sy+midY] = 0;
                    this.board[sx][sy] = 0;
                    this.board[targetX][targetY] = (piece-1)/10;
                    this.redrawBoard = true;
                    sx = targetX;
                    sy = targetY;
                }
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        if(this.board[i][j]===-1 || this.board[i][j]===-2) {
                            this.board[i][j] = 0;
                        }
                        this.path[i][j] = null;
                    }
                }
                for(var j=0; j<8; j++) {
                    if(this.board[0][j]===1) {
                        this.board[0][j] = 10;
                    }
                }
                for(var j=0; j<8; j++) {
                    if(this.board[7][j]===2) {
                        this.board[7][j] = 20;
                    }
                }
                this.boardState = "none";
                this.redrawBoard = true;
                this.moveSound.play();
                this.changePlayer();
            }
            else {
                for(var i=0; i<8; i++) {
                    for(var j=0; j<8; j++) {
                        if(this.board[i][j]===-1 || this.board[i][j]===-2) {
                            this.board[i][j] = 0;
                        }
                        else {
                            if(this.board[i][j]===11 || this.board[i][j]===101 || this.board[i][j]===21 || this.board[i][j]===201) {
                                this.board[i][j] = (this.board[i][j]-1)/10; // Deselect the piece.
                            }
                            else if(this.board[i][j]===11101 || this.board[i][j]===111101 || this.board[i][j]===22201 || this.board[i][j]===222201) {
                                this.board[i][j] = (this.board[i][j]-1)/100;    // Deselect the piece
                            }
                        }
                    }
                }
                if(this.player === 1) {
                    if(this.board[x][y] === 1 || this.board[x][y] === 10) { // If player 1's piece, or player 1's king piece
                        this.board[x][y] = this.board[x][y]*10 + 1; // Reselect the piece selected.
                        this._highlightAvailableMoves(x, y, this.board[x][y], 1);
                        this.boardState = "selected";
                        console.log(this.board);
                    }
                    else if(this.board[x][y] === 111 || this.board[x][y] === 1111) {    // If player 1's immovable piece.
                        this.board[x][y] = this.board[x][y]*100 + 1;    // Select the piece
                        this.boardState = "selected";
                        console.log(this.board);
                    }
                    else {
                        this.boardState = "none";   // Clicked outside. Back to none selected state.
                    }
                }
                else {
                    if(this.board[x][y] === 2 || this.board[x][y] === 20) { // If player 2's piece, or player 2's king piece
                        this.board[x][y] = this.board[x][y]*10 + 1; // Make the piece selected.
                        this._highlightAvailableMoves(x, y, this.board[x][y], 2);
                        this.boardState = "selected";
                        console.log(this.board);
                    }
                    else if(this.board[x][y] === 222 || this.board[x][y] === 2222) {    // If player 1's immovable piece.
                        this.board[x][y] = this.board[x][y]*100 + 1;    // Select the piece
                        this.boardState = "selected";
                        console.log(this.board);
                    }
                    else {
                        this.boardState = "none";
                    }
                }
            }
        }
        this.redrawBoard = true;
    },

    createEmptyMatrix: function(n,m) {
	    var ret = [];
        for(var i=0; i<n; i++) {
	        ret[i] = [];
        }
        return ret;
    },

    _highlightAvailableMoves: function(x, y, piece, player, checkingForcedMove) {
        this.path = this.createEmptyMatrix(8,8);
        this.currentPath = [];
	    var dx,dy;
        if(piece===1 || piece===2 || piece===11 || piece===21) {
	        if(player === 1) {
	            dx = [-1, -1];
	            dy = [-1, 1];
            }
            else {
	            dx = [1, 1];
	            dy = [-1, 1];
            }
        }
        else {
            dx = [1, 1, -1, -1];
            dy = [1, -1, 1, -1];
        }

        var dx2,dy2;
        if(piece===1 || piece===2 || piece===11 || piece===21) {
            if(player === 1) {
                dx2 = [-2, -2];
                dy2 = [-2, 2];
            }
            else {
                dx2 = [2, 2];
                dy2 = [-2, 2];
            }
        }
        else {
            dx2 = [2, 2, -2, -2];
            dy2 = [2, -2, 2, -2];
        }
        // First checking for capture moves, which will be mandatory.
        var mandatory = false;

        this.visited = this.createEmptyMatrix(8,8);
        this.moves = [];

        this.dfs(x, y, dx2, dy2, player);

        if(!this.moves.length) {
            if(!checkingForcedMove) {
                for (var i = 0; i < dx.length; i++) {
                    var nx = x + dx[i];
                    var ny = y + dy[i];
                    if (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
                        if (!this.board[nx][ny]) {
                            this.board[nx][ny] = -1;
                            this.moves.push({x: nx, y: ny});
                        }
                    }
                }
            }
        }
        //
        // for(var i=0; i<dx2.length; i++) {
	     //    var nx,ny;
	     //    nx = x + dx2[i];
	     //    ny = y + dy2[i];
	     //    var up = (dx2[i]<0);
	     //    var right = (dy2[i]>0);
	     //    if(nx>=0 && nx<8 && ny>=0 && ny<8) {
	     //        if(this.board[nx][ny] === 0) {
        //
        //         }
        //     }
        // }
    },

    dfs: function(x, y, dx, dy, player) {
	    this.visited[x][y] = 1;
	    var ret = false;
	    this.currentPath.push({x: x, y: y});
	    for(var i=0; i<dx.length; i++) {
	        var nx = x + dx[i];
	        var ny = y + dy[i];
	        if(nx>=0 && nx<8 && ny>=0 && ny<8) {
                if (dx[i] > 1 || dx[i] < -1) {   // capture move
                    var nx2 = x + dx[i] / 2;
                    var ny2 = y + dy[i] / 2;
                    if (player === 1) {
                        if (this.board[nx2][ny2] === 2 || this.board[nx2][ny2] === 20) {
                            if (!this.board[nx][ny] && !this.visited[nx][ny]) {
                                ret = true;
                                var temp = this.dfs(nx, ny, dx, dy, player);
                                if (!temp) {
                                    this.board[nx][ny] = -2;
                                    this.path[nx][ny] = JSON.parse(JSON.stringify(this.currentPath));
                                    this.moves.push({x: nx, y: ny});
                                }
                            }
                        }
                    }
                    else {
                        if (this.board[nx2][ny2] === 1 || this.board[nx2][ny2] === 10) {
                            if (!this.board[nx][ny] && !this.visited[nx][ny]) {
                                ret = true;
                                var temp = this.dfs(nx, ny, dx, dy, player);
                                if (!temp) {
                                    this.board[nx][ny] = -2;
                                    this.path[nx][ny] = JSON.parse(JSON.stringify(this.currentPath));
                                    this.moves.push({x: nx, y: ny});
                                }
                            }
                        }
                    }
                }
            }
        }
        this.currentPath.pop();
        return ret;
    }
}
