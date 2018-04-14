"use strict";

var play = function(game) {
};

play.prototype = {
	preload: function() {
		console.log("Play!");
	},

	create: function() {
		this.redrawBoard = false;
	    this.init();
		this.drawBackground();
        // this.inputAllowed = false;
        // this.lastClickedTile = null;
        // this._setBoardStyle('american');
        // this._setupBoardGraph();
        // this._initializeTokens();
        this.drawBoard();
        // this.turnLimit = 40;
        // this.turnCounter = 0;

        //Assumes Both players are human on the same device
        // this._createStartState({1: true, 2: true});
	},

	init: function() {
		this.hasGameStarted = false;
	},

	update: function() {
		if (this.hasGameStarted == true) {
			this.updateTimer();
		}
		if(this.redrawBoard) {
		    for(var i=0; i<8; i++) {
		        for(var j=0; j<8; j++) {
		            switch(this.board[i][j]) {
                        case 1: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                                var piece = this.game.add.image(60+j*120, 480+i*120, "checker-dark");
                                this.checkerBoard[i][j] = piece;
                            break;
                        case 10: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-dark-king");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 11: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-dark-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 101: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-dark-king-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 2: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-light");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 20: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-light-king");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 21: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-light-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case 201: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece = this.game.add.image(60+j*120, 480+i*120, "checker-light-king-selected");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case -1: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece;
                            if(this.player === 1)
                                piece = this.game.add.image(60+j*120, 480+i*120, "checker-dark-place");
                            else
                                piece = this.game.add.image(60+j*120, 480+i*120, "checker-light-place");
                            this.checkerBoard[i][j] = piece;
                            break;
                        case -2: this.checkerBoard[i][j] && this.checkerBoard[i][j].destroy();
                            var piece;
                            if(this.player === 1)
                                piece = this.game.add.image(60+j*120, 480+i*120, "checker-dark-place");
                            else
                                piece = this.game.add.image(60+j*120, 480+i*120, "checker-light-place");
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
	},

	drawBoard: function() {

	    this.boardState = "none";   // boardState: none, highlighted
	    this.player = 1;

		var bg = this.game.add.image(10, 430, "board-background");
        bg.inputEnabled = true;
        bg.input.priorityID = 0;
        bg.events.onInputDown.add(this.onBackgroundClicked, this);

        this.board = [];
		this.currentPath = [];
		this.path = [];
		this.checkerBoard = [];
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

		var posTop = CONSTANTS.BOARD.OFFSET.TOP;
		var cnt = 0;
		for (var row = 0; row < CONSTANTS.BOARD.ROWS; row++) {
			var posLeft = CONSTANTS.BOARD.OFFSET.LEFT;
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
	},

    changePlayer: function() {
	    if(this.player===1) {
	        this.player = 2;
        }
        else {
	        this.player = 1;
        }
    },

    onBackgroundClicked: function(e) {
	    this.handleInput(0,0);
    },

	onPieceSelected: function(e) {
		//console.log(e);
		var x, y;
		var left = e.position.x;
		var top = e.position.y;
		y = (left-60)/120;
		x = (top-480)/120;
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
            }
            else {
                if(this.board[x][y] === 2 || this.board[x][y] === 20) { // If player 2's piece, or player 2's king piece
                    this.board[x][y] = this.board[x][y]*10 + 1; // Make the piece selected.
                    this._highlightAvailableMoves(x, y, this.board[x][y], 2);
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
                this.redrawBoard = true;
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
                this.redrawBoard = true;
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

    _highlightAvailableMoves: function(x, y, piece, player) {
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
            for(var i=0; i<dx.length; i++) {
                var nx = x + dx[i];
                var ny = y + dy[i];
                if(nx>=0 && nx<8 && ny>=0 && ny<8) {
                    if (!this.board[nx][ny]) {
                        this.board[nx][ny] = -1;
                        this.moves.push({x: nx, y: ny});
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

    // movePiece: function(e) {
    //
    // },
    //
	// // Todo : should be refactored to some kind of util file
    //
    //
    // _setBoardStyle: function(style) {
     //    this.style = style;
     //    if(this.style === 'international') {
     //        this.rows = 10;
     //        this.cols = 10;
     //        this.initialTokens = 20;
     //    }
    //
     //    if(this.style === 'american') {
     //        this.rows = 8;
     //        this.cols = 8;
     //        this.initialTokens = 12;
     //    }
    // },
    //
    // _setPlayableTile: function(x, y, value) {
     //    if(typeof this.playableTiles[x] === 'undefined') {
     //        this.playableTiles[x] = {};
     //    }
     //    this.playableTiles[x][y] = value;
    // },
    //
     //    // this.playableTiles[x][y] stores an object defining tile. {row, col, occupiedBy, adjacentTiles{direction,playableTiles[i][j]} }.
    //
    // _setupBoardGraph: function() {
     //    this.playableTiles = {};
     //    var i = 1, j = 1;
     //    for(i = 1; i <= this.rows; i++)
     //        for(j = 1; j <= this.cols; j++) {
     //            if((i+j)%2 === 1) {
     //                var curTile = {};
     //                curTile.row = i;
     //                curTile.col = j;
     //                curTile.occupiedBy = null;
     //                this._setPlayableTile(i, j, curTile);
     //                // this.playableTiles[i][j] = curTile;
     //            }
     //        }
    //
     //    for(i = 1; i <= this.rows; i++)
     //        for(j = 1; j <= this.cols; j++) {
     //            if((i+j)%2 === 1) {
     //                var curTile = this.playableTiles[i][j];
     //                var adjacentTiles = [];
     //                var dx = [-1, -1, +1, +1];
     //                var dy = [-1, +1, -1, +1];
    //
     //                for(var k = 0; k < 4; k++) {
     //                    var newX = i+dx[k];
     //                    var newY = j+dy[k];
     //                    var vertical = (dx[k] < 0)?'Up':'Down';
     //                    var horizontal = (dy[k] < 0)?'Left':'Right';
     //                    var direction = vertical+horizontal;
     //                    var adjacentTile = {};
     //                    adjacentTile.direction = direction;
     //                    adjacentTile.tile = null;
     //                    if(newX > 0 && newX <= 8 && newY > 0 && newY <= 8)
     //                        adjacentTile.tile = this.playableTiles[newX][newY];
     //                    adjacentTiles.push(adjacentTile);
     //                }
     //                this.playableTiles[i][j].adjacentTiles = adjacentTiles;
     //            }
     //        }
    //
    // },
    //
    // _initializeTokens: function() {
     //    this.playerTokens = {};
     //    this.capturedTokens = {};
     //    for (var i = 1; i <= 2; i++)
     //    {
     //        this._createPlayerTokens(i);
     //        this._placePlayerTokens(i);
     //    }
    // },
    //
    // _createPlayerTokens: function(player) {
     //    this.playerTokens[player] = [];
     //    this.capturedTokens[player] = [];
     //    for(var i = 0; i < this.initialTokens; i++) {
     //        var token = {};
     //        token.isPromoted = false;
     //        token.player = player;
     //        token.id = i;
     //        this.playerTokens[player].push(token);
     //    }
    // },
    //
    // /*
     //    Place Player Tokens. Keep placing tokens from the first (row, col) till all placed
     // */
    // _placePlayerTokens: function(player) {
     //    var rowCount = 0;
     //    var curX = 1, curY = 2;
     //    if(this.style === 'american')
     //        rowCount = 3;
     //    if(this.style === 'international')
     //        rowCount = 4;
     //    if(player === 1) {
     //        curX = 1;
     //        curY = 2;
     //    }
     //    if(player === 2) {
     //        if(this.style === 'american'){
     //            curX = 6;
     //            curY = 1;
     //        }
     //        if(this.style === 'international') {
     //            curX = 7;
     //            curY = 2;
     //        }
     //    }
    //
     //    for(var pos = 0; pos < this.playerTokens[player].length; pos++) {
     //        this._placeTokenAt(this.playerTokens[player][pos], curX, curY);
     //        curY += 2;
     //        if(curY > this.cols) {
     //            curX++;
     //            if(curX%2 === 0)    curY = 1;
     //            else                curY = 2;
     //        }
     //    }
    // },
    //
    // /*
     //    Update Tile at (x, y) to know what occupies it,
     //    Update Token to notify that it occupies tile (x, y)
     // */
    // _placeTokenAt: function(token, x, y) {
     //    token.onTile = this.playableTiles[x][y];
     //    this.playableTiles[x][y].occupiedBy = token;
    // },
    //
    // _createStartState: function(humans){
     //    this.isHuman = humans;
     //    this._activatePlayer(1);
    // },
    //
    // //ToDo: Sahil and Priyanshu
    // _registerInput: function(x, y) {
     //    if(!this.inputAllowed)  return;
     //    this.lastClickedTile = this.playableTiles[x][y];
     //    this._updateStateOnClick(this.lastClickedTile);
    // },
    //
    // _activatePlayer: function(player) {
     //    this.turnCounter++;
     //    this.activePlayer = player;
     //    this.gameState = 'selectToken';
     //    this.forcedCapture = this._checkForcedCapture();
     //    this._enableInput(player);
    // },
    //
    // _enableInput: function(player) {
     //    if(this.isHuman[player]) {
     //        this.inputAllowed = true;
     //    }
    // },
    //
    // _checkForcedCapture: function() {
     //    var returnValue = false;
     //    var that = this;
     //    //can use for loop here for efficency (not a great increase)
     //    this.playerTokens[this.activePlayer].forEach(function(token){
     //        if(that._hasCaptureMove(token)) {
     //            returnValue = true;
     //        }
     //    });
     //    return returnValue;
    // },
    //
    // _hasNormalMove: function(token) {
     //    var tile = token.onTile;
     //    var that = this;
     //    var returnVal = false;
     //    tile.adjacentTiles.forEach(function(adjTile) {
     //        if(adjTile.tile !== null && that._isValidSingleStep(token, adjTile.tile)) {
     //            returnVal = true;
     //        }
     //    });
     //    return returnVal;
    // },
    //
    // _hasCaptureMove: function(token) {
     //    var curTile = token.onTile;
     //    var adjacentTiles = curTile.adjacentTiles;
     //    var that = this;
     //    var returnValue = false;
     //    adjacentTiles.forEach(function(adjTile) {
     //        if(adjTile.tile !== null && that._canCapture(token.onTile, adjTile.tile)) {
     //            returnValue = true;
     //        }
     //    });
     //    return returnValue;
    // },
    //
    // //Checks whether token on tile1 can valid capture token on tile2
    //
    // _canCapture: function(tile1, tile2) {
     //    var dx = tile2.row - tile1.row;
     //    var dy = tile2.col - tile1.col;
     //    var token1 = tile1.occupiedBy;
     //    var token2 = tile2.occupiedBy;
    //
     //    if(token1 === null || token2 === null || token1.player === token2.player || token1.player !== this.activePlayer)
     //        return false;
    //
     //    if(!token1.isPromoted && token1.player === 1 && dx < 0) return false;
     //    if(!token1.isPromoted && token1.player === 2 && dx > 0) return false;
     //    if(Math.abs(dx) > 1 && Math.abs(dy) > 1) return false;
    //
     //    var newX = tile1.row + 2*dx;
     //    var newY = tile1.col + 2*dy;
    //
     //    if(typeof this.playableTiles[newX][newY] === 'undefined') return false;
    //
     //    if(this.playableTiles[newX][newY].occupiedBy === null) return true;
    //
     //    return false;
    //
    // },
    //
    // _isValidSingleStep: function(token, tile) {
     //    var tile1 = token.onTile;
     //    var tile2 = tile;
     //    var dx = tile2.row - tile1.row;
     //    var dy = tile2.col - tile1.col;
     //    var token1 = tile1.occupiedBy;
     //    var token2 = tile2.occupiedBy;
    //
     //    if(token2 !== null) return false;
    //
     //    if(!token1.isPromoted && token1.player === 1 && dx < 0) return false;
     //    if(!token1.isPromoted && token1.player === 2 && dx > 0) return false;
    //
     //    return (Math.abs(dx) === 1 && Math.abs(dy) === 1);
    // },
    //
    // _isValidMove: function(token, tile) {
     //    if(this._isValidCaptureMove(token, tile))    return true;
     //    if(!this.forcedCapture && this._isValidSingleStep(token, tile)) return true;
     //    return false;
    // },
    //
    // _isValidCaptureMove: function(token, tile) {
     //    var tokenX = token.onTile.row, tokenY = token.onTile.col;
     //    var tileX = tile.row, tileY = tile.col;
    //
     //    var dx = tileX - tokenX, dy = tileY - tokenY;
    //
     //    if(Math.abs(dx) !== 2 && Math.abs(dy) !== 2) return false;
    //
     //    var newdx = dx/2, newdy = dy/2;
    //
     //    return this._canCapture(token.onTile, this.playableTiles[tokenX+newdx][tokenY+newdy].tile);
    // },
    //
    // _getTokenForCaptureMove: function(token, tile) {
     //    var tokenX = token.onTile.row, tokenY = token.onTile.col;
     //    var tileX = tile.row, tileY = tile.col;
    //
     //    var dx = tileX - tokenX, dy = tileY - tokenY;
    //
     //    if(Math.abs(dx) !== 2 && Math.abs(dy) !== 2) return false;
    //
     //    var newdx = dx/2, newdy = dy/2;
     //    return this.playableTiles[tokenX+newdx][tokenY+newdy].occupiedBy;
    // },
    //
    // //Done
    // canPromote: function(token) {
     //    if(token.isPromoted) return false;
    //
     //    if(token.player === 1 && token.onTile.row === this.rows) return true;
    // },
    //
    // //Done
    // promoteToken: function(token) {
     //    token.isPromoted = true;
    // },
    //
    //
    // //Done
    // _makeMove: function(token, tile) {
     //    if(this._isValidCaptureMove(token, tile)) {
     //        this._captureToken(token, this._getTokenForCaptureMove(token, tile));
     //    }
     //    token.image.destroy();
     //    token.onTile = tile;
     //    if(token.player === 1) {
     //        var posLeft = (tile.col-1)*120 + CONSTANTS.BOARD.OFFSET.LEFT;
     //        var posTop = (tile.row-1)*120 + CONSTANTS.BOARD.OFFSET.TOP;
     //        token.image = this.game.add.image(posLeft, posTop, "checker-light");
     //    }
     //    else {
     //        var posLeft = (tile.col-1)*120 + CONSTANTS.BOARD.OFFSET.LEFT;
     //        var posTop = (tile.row-1)*120 + CONSTANTS.BOARD.OFFSET.TOP;
     //        token.image = this.game.add.image(posLeft, posTop, "checker-dark");
     //    }
     //    tile.occupiedBy = token;
     //    if(this.canPromote(token)) this.promoteToken(token);
    // },
    //
    // //Done
    // _captureToken: function(token1, token2) {
     //    this.turnCounter = 0;
     //    var occupiedTile = token2.occupiedBy;
     //    occupiedTile.occupiedBy = null;
     //    token2.onTile = null;
     //    this.capturedTokens[token2.player].push(token2);
     //    var index = this.playerTokens[token2.player].indexOf(token2);
     //    this.playerTokens[token2.player].splice(index, 1);
    // },
    //
    // //Done
    // _isValidSelect: function(tile) {
     //    return (tile.occupiedBy.player === this.activePlayer);
    // },
    //
    // //Done
    // _selectActiveToken: function(token) {
     //    this.activeToken = token;
     //    this._highlightAvailableMoves(token);
     //    this._highlightTile(token.onTile, true, 'selected');
    // },
    //
    // //Done
    // _deselectActiveToken: function(token) {
     //    this.activeToken = null;
     //    this._unHighlightAvailableMoves(token);
     //    this._highlightTile(token.onTile, false, 'selected');
    // },
    //
    // //Done, Review
    // /*
     //    tile {
     //        row, col, adjacentTiles, occupiedBy
     //    }
     // */
    // _highlightTile: function(tile, highlight, type) {
     //    if(highlight) {
     //        if(type === "selected") {
    //
     //        }
     //        else if(type ===  "canMove") {
    //
     //        }
     //    }
     //    else {
     //        if(type === "selected") {
    //
     //        }
     //        else if(type ===  "canMove") {
    //
     //        }
     //    }
     //    //ToDo: Sahil
    // },
    // //Done, Review
    // _unHighlightTile: function(tile) {
     //    //ToDo: Sahil
    // },
    // //Done, Review
    // _highlightTiles: function(arrayOfTiles, activate, type) {
     //    var that = this;
     //    arrayOfTiles.forEach(function(tile) {
     //        if(activate) that._highlightTile(tile, true, type);
     //        else         that._highlightTile(tile, false, type);
     //    })
    // },
    // //Done, Review
    // _unHighlightAvailableMoves: function(token) {
     //    this._highlightTiles(this.availableMoves, false);
     //    this.availableMoves = null;
    // },
    // //Done, Review
    // _highlightAvailableMoves: function(token) {
     //    var availableTiles = this._getAvailableMoveTiles(token);
     //    this.availableMoves = availableTiles;
     //    this._highlightTiles(availableTiles, true, 'canMove');
    //
    // },
    //
    // //Done
    // _getAvailableMoveTiles: function(token) {
     //    var dx = 1, dy = 1;
     //    if(this.forcedCapture) {
     //        dx = 2;
     //        dy = 2;
     //    }
     //    var setOfTiles = [];
    //
     //    var DX = [-dx, -dx, dx, dx];
     //    var DY = [-dy, dy, -dy, dy];
     //    var x = token.onTile.row, y = token.onTile.col;
    //
     //    for(var i = 0; i < 4; i++) {
     //        var newX = x+DX[i], newY = y+DY[i];
     //        var newTile = null;
     //        if(typeof this.playableTiles[newX][newY] !== 'undefined')
     //            newTile = this.playableTiles[newX][newY];
    //
     //        if(this._isValidMove(token, newTile)) {
     //            setOfTiles.push(newTile);
     //        }
     //    }
    //
     //    return setOfTiles;
    // },
    //
    //
    // //Done Review
    // _setGameState: function(state) {
     //    this.gameState = state;
     //    switch(state) {
     //        case 'selectToken':
     //            this.availableMoves = {};
     //            this.activeToken = null;
     //            break;
     //        case 'moveToken':
     //            break;
     //        case 'endTurn':
     //            this._endTurn();
     //            break;
     //        default:
     //            console.log('Invalid State!');
     //    }
    // },
    //
    // //Done, Review
    // _updateStateOnClick: function(clickedTile) {
     //    switch(this.gameState) {
     //        case 'selectToken':
     //            if(this._isValidSelect(clickedTile)) {
     //                this._selectActiveToken(clickedTile.occupiedBy);
     //                this._setGameState('moveToken');
     //            }
     //            break;
     //        case 'moveToken':
     //            if(this._isValidMove(this.activeToken, clickedTile)) {
     //                var wasPromoted = JSON.parse(JSON.stringify(this.activeToken.isPromoted));
     //                this._makeMove(this.activeToken, clickedTile);
     //                if(this.forcedCapture && this._hasCaptureMove(this.activeToken) && (wasPromoted === this.activeToken.isPromoted))
     //                    this._setGameState('moveTokenAgain');
     //                else
     //                    this._setGameState('endTurn');
     //                break;
     //            }
     //            else {
     //                this._deselectActiveToken(this.activeToken);
     //                this._setGameState('selectToken');
     //            }
     //            break;
     //        case 'moveTokenAgain':
     //            if(this._isValidMove(this.activeToken, clickedTile)) {
     //                var wasPromoted = JSON.parse(JSON.stringify(this.activeToken.isPromoted));
     //                this._makeMove(this.activeToken, clickedTile);
     //                if(this.forcedCapture && this._hasCaptureMove(this.activeToken) && (wasPromoted === this.activeToken.isPromoted))
     //                    this._setGameState('moveTokenAgain');
     //                else
     //                    this._setGameState('endTurn');
     //                break;
     //            }
     //            break;
     //        default:
     //            console.log('No Action on State : ', this.gameState);
     //    }
    // },
    //
    // _isGameOver: function() {
     //    if(this.turnCounter === this.turnLimit) return true;
     //    if(this.activePlayer === 1) {
     //        if(this._hasNoMove(2))
     //            return true;
    //
     //    }
     //    else {
     //        if(this.activePlayer === 2)
     //            if(this._hasNoMove(1))
     //                return true;
     //    }
     //    return false;
    // },
    //
    // _hasAnyMove: function(token) {
     //    return (this._hasCaptureMove(token) || this._hasNormalMove(token));
    // },
    //
    // _hasNoMove: function(player) {
     //    var returnVal = true;
     //    var that = this;
     //    this.playerTokens[player].forEach(function(token) {
     //        if(that._hasAnyMove(token)) {
     //            returnVal = false;
     //        }
     //    });
     //    return returnVal;
    // },
    //
    // _gameOver: function() {
     //    if(this.turnCounter === this.turnLimit)
     //        this._endGame('draw');
     //    if(this.activePlayer === 1) {
     //        if(this._hasNoMove(2))
     //            return this._endGame('over', 1);
    //
     //    }
     //    else {
     //        if(this.activePlayer === 2)
     //            if(this._hasNoMove(1))
     //                return this._endGame('over', 2);
     //    }
     //    return false;
    // },
    //
    // _endTurn: function() {
     //    if(this._isGameOver())
     //        this._gameOver();
     //    else {
     //        if (this.activePlayer === 1)
     //            this._activatePlayer(2);
     //        else
     //            this._activatePlayer(1);
     //    }
    // },
    //
    // _endGame: function(state, winner) {
     //    // kapow.invokeRPC('postScore', {"score": this.score}, function() {
     //    //     console.log("Success Posting Score");
     //    // }, function(error) {
     //    //     console.log("Failure Posting score", error);
     //    // });
     //    // this.gameEndText = TextUtil.createText(this.game, {
     //    //     positionX: this.world.centerX,
     //    //     positionY: 560,
     //    //     message: "Game Over",
     //    //     align: "center",
     //    //     backgroundColor: "#000000",
     //    //     fill: "#fefefe",
     //    //     font: 'nunito-regular',
     //    //     fontSize: "80px",
     //    //     fontWeight: 800,
     //    //     wordWrapWidth: 355,
     //    //     anchorX: 0.5,
     //    //     anchorY: 0
     //    // });
     //    // this.game.stage.addChild(this.gameEndText);
     //    // // this._createPlayButton();
     //    // this._drawScoreboard();
    // },
    //
    // endGame: function() {
	// 	this.hasGameStarted = false;
	// 	this.nextTap.setText("!");
    //
	// 	var obj = {
	// 		"time" : this.endTime - this.startTime
	// 	};
	// 	kapow.invokeRPC('postScore', obj, function() {
	// 		console.log("Posted score successfully!");
	// 	}, function(error) {
	// 		console.log("Error while posting score ", error);
	// 	});
	// }

}
