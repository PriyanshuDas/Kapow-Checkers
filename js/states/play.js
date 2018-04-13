"use strict";

var play = function(game) {
};

play.prototype = {
	preload: function() {
		console.log("Preload");
	},

	create: function() {
		this.init();
		this.drawBackground();
        this.inputAllowed = false;
        this.lastClickedTile = null;
        this._setBoardStyle('american');
        this._setupBoardGraph();
        this._initializeTokens();
        this.drawBoard();
        this.turnLimit = 40;
        this.turnCounter = 0;

        //Assumes Both players are human on the same device
        this._createStartState({1: true, 2: true});
	},

	init: function() {
		this.hasGameStarted = false;
	},

	update: function() {
		if (this.hasGameStarted == true) {
			this.updateTimer();
		}
	},

	drawBackground: function() {
		this.game.stage.backgroundColor = "#f4f2f5";
	},

	drawBoard: function() {
		this.game.add.image(10, 430, "board-background")
		var posTop = CONSTANTS.BOARD.OFFSET.TOP;
		var cnt = 0;
		for (var row = 0; row < CONSTANTS.BOARD.ROWS; row++) {
			var posLeft = CONSTANTS.BOARD.OFFSET.LEFT;
			for (var col = 0; col < CONSTANTS.BOARD.COLS; col++) {
				if((row+col)%2===1) {
                    var tile = this.game.add.image(posLeft, posTop, "cell");
                    this.playableTiles[row+1][col+1].image = tile;
                    cnt++;
                    var checkerPiece = null;
                    if(cnt>=1 && cnt<=12) {
                        var curTile = this.playableTiles[row+1][col+1];
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-light");
                        curTile.occupiedBy.image = checkerPiece;
					
                    }
					else if(cnt>=21 && cnt<=32) {
                        checkerPiece = this.game.add.image(posLeft, posTop, "checker-dark");
					}
					if(checkerPiece) {
                    	checkerPiece.inputEnabled = true;
                    	checkerPiece.events.onInputDown.add(this.onPieceSelected, this);
					}
					else {
                        tile.inputEnabled = true;
                        tile.events.onInputDown.add(this.onPieceSelected, this);
                    }
                }
				// this.addCellOnBoard(posLeft, posTop, this.prettify(this.firstFace[id], 2));
				 posLeft += CONSTANTS.BOARD.CELL.WIDTH + CONSTANTS.BOARD.CELL_SPACING;
				// id += 1;
			}
			posTop += CONSTANTS.BOARD.CELL.HEIGHT + CONSTANTS.BOARD.CELL_SPACING;
		}
	},

	onPieceSelected: function(e) {
		//console.log(e);
		var x, y;
		var left = e.position.x;
		var top = e.position.y;
		y = (left-60)/120 + 1;
		x = (top-480)/120 + 1;
		console.log(x, y);
		this._registerInput(x, y);

	},

    movePiece: function(e) {

    },

	// Todo : should be refactored to some kind of util file


    _setBoardStyle: function(style) {
        this.style = style;
        if(this.style === 'international') {
            this.rows = 10;
            this.cols = 10;
            this.initialTokens = 20;
        }

        if(this.style === 'american') {
            this.rows = 8;
            this.cols = 8;
            this.initialTokens = 12;
        }
    },

    _setPlayableTile: function(x, y, value) {
        if(typeof this.playableTiles[x] === 'undefined') {
            this.playableTiles[x] = {};
        }
        this.playableTiles[x][y] = value;
    },

        // this.playableTiles[x][y] stores an object defining tile. {row, col, occupiedBy, adjacentTiles{direction,playableTiles[i][j]} }.

    _setupBoardGraph: function() {
        this.playableTiles = {};
        var i = 1, j = 1;
        for(i = 1; i <= this.rows; i++)
            for(j = 1; j <= this.cols; j++) {
                if((i+j)%2 === 1) {
                    var curTile = {};
                    curTile.row = i;
                    curTile.col = j;
                    curTile.occupiedBy = null;
                    this._setPlayableTile(i, j, curTile);
                    // this.playableTiles[i][j] = curTile;
                }
            }

        for(i = 1; i <= this.rows; i++)
            for(j = 1; j <= this.cols; j++) {
                if((i+j)%2 === 1) {
                    var curTile = this.playableTiles[i][j];
                    var adjacentTiles = [];
                    var dx = [-1, -1, +1, +1];
                    var dy = [-1, +1, -1, +1];

                    for(var k = 0; k < 4; k++) {
                        var newX = i+dx[k];
                        var newY = j+dy[k];
                        var vertical = (dx[k] < 0)?'Up':'Down';
                        var horizontal = (dy[k] < 0)?'Left':'Right';
                        var direction = vertical+horizontal;
                        var adjacentTile = {};
                        adjacentTile.direction = direction;
                        adjacentTile.tile = null;
                        if(newX > 0 && newX <= 8 && newY > 0 && newY <= 8)
                            adjacentTile.tile = this.playableTiles[newX][newY];
                        adjacentTiles.push(adjacentTile);
                    }
                    this.playableTiles[i][j].adjacentTiles = adjacentTiles;
                }
            }

    },

    _initializeTokens: function() {
        this.playerTokens = {};
        this.capturedTokens = {};
        for (var i = 1; i <= 2; i++)
        {
            this._createPlayerTokens(i);
            this._placePlayerTokens(i);
        }
    },

    _createPlayerTokens: function(player) {
        this.playerTokens[player] = [];
        this.capturedTokens[player] = [];
        for(var i = 0; i < this.initialTokens; i++) {
            var token = {};
            token.isPromoted = false;
            token.player = player;
            token.id = i;
            this.playerTokens[player].push(token);
        }
    },

    /*
        Place Player Tokens. Keep placing tokens from the first (row, col) till all placed
     */
    _placePlayerTokens: function(player) {
        var rowCount = 0;
        var curX = 1, curY = 2;
        if(this.style === 'american')
            rowCount = 3;
        if(this.style === 'international')
            rowCount = 4;
        if(player === 1) {
            curX = 1;
            curY = 2;
        }
        if(player === 2) {
            if(this.style === 'american'){
                curX = 6;
                curY = 1;
            }
            if(this.style === 'international') {
                curX = 7;
                curY = 2;
            }
        }

        for(var pos = 0; pos < this.playerTokens[player].length; pos++) {
            this._placeTokenAt(this.playerTokens[player][pos], curX, curY);
            curY += 2;
            if(curY > this.cols) {
                curX++;
                if(curX%2 === 0)    curY = 1;
                else                curY = 2;
            }
        }
    },

    /*
        Update Tile at (x, y) to know what occupies it,
        Update Token to notify that it occupies tile (x, y)
     */
    _placeTokenAt: function(token, x, y) {
        token.onTile = this.playableTiles[x][y];
        this.playableTiles[x][y].occupiedBy = token;
    },

    _createStartState: function(humans){
        this.isHuman = humans;
        this._activatePlayer(1);
    },

    //ToDo: Sahil and Priyanshu
    _registerInput: function(x, y) {
        if(!this.inputAllowed)  return;
        this.lastClickedTile = this.playableTiles[x][y];
        this._updateStateOnClick(this.lastClickedTile);
    },

    _activatePlayer: function(player) {
        this.turnCounter++;
        this.activePlayer = player;
        this.gameState = 'selectToken';
        this.forcedCapture = this._checkForcedCapture();
        this._enableInput(player);
    },

    _enableInput: function(player) {
        if(this.isHuman[player]) {
            this.inputAllowed = true;
        }
    },

    _checkForcedCapture: function() {
        var returnValue = false;
        var that = this;
        //can use for loop here for efficency (not a great increase)
        this.playerTokens[this.activePlayer].forEach(function(token){
            if(that._hasCaptureMove(token)) {
                returnValue = true;
            }
        });
        return returnValue;
    },

    _hasNormalMove: function(token) {
        var tile = token.onTile;
        var that = this;
        var returnVal = false;
        tile.adjacentTiles.forEach(function(adjTile) {
            if(adjTile.tile !== null && that._isValidSingleStep(token, adjTile.tile)) {
                returnVal = true;
            }
        });
        return returnVal;
    },

    _hasCaptureMove: function(token) {
        var curTile = token.onTile;
        var adjacentTiles = curTile.adjacentTiles;
        var that = this;
        var returnValue = false;
        adjacentTiles.forEach(function(adjTile) {
            if(adjTile.tile !== null && that._canCapture(token.onTile, adjTile.tile)) {
                returnValue = true;
            }
        });
        return returnValue;
    },

    //Checks whether token on tile1 can valid capture token on tile2

    _canCapture: function(tile1, tile2) {
        var dx = tile2.row - tile1.row;
        var dy = tile2.col - tile1.col;
        var token1 = tile1.occupiedBy;
        var token2 = tile2.occupiedBy;

        if(token1 === null || token2 === null || token1.player === token2.player || token1.player !== this.activePlayer)
            return false;

        if(!token1.isPromoted && token1.player === 1 && dx < 0) return false;
        if(!token1.isPromoted && token1.player === 2 && dx > 0) return false;
        if(Math.abs(dx) > 1 && Math.abs(dy) > 1) return false;

        var newX = tile1.row + 2*dx;
        var newY = tile1.col + 2*dy;

        if(typeof this.playableTiles[newX][newY] === 'undefined') return false;

        if(this.playableTiles[newX][newY].occupiedBy === null) return true;

        return false;

    },

    _isValidSingleStep: function(token, tile) {
        var tile1 = token.onTile;
        var tile2 = tile;
        var dx = tile2.row - tile1.row;
        var dy = tile2.col - tile1.col;
        var token1 = tile1.occupiedBy;
        var token2 = tile2.occupiedBy;

        if(token2 !== null) return false;

        if(!token1.isPromoted && token1.player === 1 && dx < 0) return false;
        if(!token1.isPromoted && token1.player === 2 && dx > 0) return false;

        return (Math.abs(dx) === 1 && Math.abs(dy) === 1);
    },

    _isValidMove: function(token, tile) {
        if(this._isValidCaptureMove(token, tile))    return true;
        if(!this.forcedCapture && this._isValidSingleStep(token, tile)) return true;
        return false;
    },

    _isValidCaptureMove: function(token, tile) {
        var tokenX = token.onTile.row, tokenY = token.onTile.col;
        var tileX = tile.row, tileY = tile.col;

        var dx = tileX - tokenX, dy = tileY - tokenY;

        if(Math.abs(dx) !== 2 && Math.abs(dy) !== 2) return false;

        var newdx = dx/2, newdy = dy/2;

        return this._canCapture(token.onTile, this.playableTiles[tokenX+newdx][tokenY+newdy].tile);
    },

    _getTokenForCaptureMove: function(token, tile) {
        var tokenX = token.onTile.row, tokenY = token.onTile.col;
        var tileX = tile.row, tileY = tile.col;

        var dx = tileX - tokenX, dy = tileY - tokenY;

        if(Math.abs(dx) !== 2 && Math.abs(dy) !== 2) return false;

        var newdx = dx/2, newdy = dy/2;
        return this.playableTiles[tokenX+newdx][tokenY+newdy].occupiedBy;
    },

    //Done
    canPromote: function(token) {
        if(token.isPromoted) return false;

        if(token.player === 1 && token.onTile.row === this.rows) return true;
    },

    //Done
    promoteToken: function(token) {
        token.isPromoted = true;
    },


    //Done
    _makeMove: function(token, tile) {
        if(this._isValidCaptureMove(token, tile)) {
            this._captureToken(token, this._getTokenForCaptureMove(token, tile));
        }
        token.image.destroy();
        token.onTile = tile;
        if(token.player === 1) {
            var posLeft = (tile.col-1)*120 + CONSTANTS.BOARD.OFFSET.LEFT;
            var posTop = (tile.row-1)*120 + CONSTANTS.BOARD.OFFSET.TOP;
            token.image = this.game.add.image(posLeft, posTop, "checker-light");
        }
        else {
            var posLeft = (tile.col-1)*120 + CONSTANTS.BOARD.OFFSET.LEFT;
            var posTop = (tile.row-1)*120 + CONSTANTS.BOARD.OFFSET.TOP;
            token.image = this.game.add.image(posLeft, posTop, "checker-dark");
        }
        tile.occupiedBy = token;
        if(this.canPromote(token)) this.promoteToken(token);
    },

    //Done
    _captureToken: function(token1, token2) {
        this.turnCounter = 0;
        var occupiedTile = token2.occupiedBy;
        occupiedTile.occupiedBy = null;
        token2.onTile = null;
        this.capturedTokens[token2.player].push(token2);
        var index = this.playerTokens[token2.player].indexOf(token2);
        this.playerTokens[token2.player].splice(index, 1);
    },

    //Done
    _isValidSelect: function(tile) {
        return (tile.occupiedBy.player === this.activePlayer);
    },

    //Done
    _selectActiveToken: function(token) {
        this.activeToken = token;
        this._highlightAvailableMoves(token);
        this._highlightTile(token.onTile, true, 'selected');
    },

    //Done
    _deselectActiveToken: function(token) {
        this.activeToken = null;
        this._unHighlightAvailableMoves(token);
        this._highlightTile(token.onTile, false, 'selected');
    },

    //Done, Review
    /*
        tile {
            row, col, adjacentTiles, occupiedBy
        }
     */
    _highlightTile: function(tile, highlight, type) {
        if(highlight) {
            if(type === "selected") {

            }
            else if(type ===  "canMove") {

            }
        }
        else {
            if(type === "selected") {

            }
            else if(type ===  "canMove") {

            }
        }
        //ToDo: Sahil
    },
    //Done, Review
    _unHighlightTile: function(tile) {
        //ToDo: Sahil
    },
    //Done, Review
    _highlightTiles: function(arrayOfTiles, activate, type) {
        var that = this;
        arrayOfTiles.forEach(function(tile) {
            if(activate) that._highlightTile(tile, true, type);
            else         that._highlightTile(tile, false, type);
        })
    },
    //Done, Review
    _unHighlightAvailableMoves: function(token) {
        this._highlightTiles(this.availableMoves, false);
        this.availableMoves = null;
    },
    //Done, Review
    _highlightAvailableMoves: function(token) {
        var availableTiles = this._getAvailableMoveTiles(token);
        this.availableMoves = availableTiles;
        this._highlightTiles(availableTiles, true, 'canMove');

    },

    //Done
    _getAvailableMoveTiles: function(token) {
        var dx = 1, dy = 1;
        if(this.forcedCapture) {
            dx = 2;
            dy = 2;
        }
        var setOfTiles = [];

        var DX = [-dx, -dx, dx, dx];
        var DY = [-dy, dy, -dy, dy];
        var x = token.onTile.row, y = token.onTile.col;

        for(var i = 0; i < 4; i++) {
            var newX = x+DX[i], newY = y+DY[i];
            var newTile = null;
            if(typeof this.playableTiles[newX][newY] !== 'undefined')
                newTile = this.playableTiles[newX][newY];

            if(this._isValidMove(token, newTile)) {
                setOfTiles.push(newTile);
            }
        }

        return setOfTiles;
    },


    //Done Review
    _setGameState: function(state) {
        this.gameState = state;
        switch(state) {
            case 'selectToken':
                this.availableMoves = {};
                this.activeToken = null;
                break;
            case 'moveToken':
                break;
            case 'endTurn':
                this._endTurn();
                break;
            default:
                console.log('Invalid State!');
        }
    },

    //Done, Review
    _updateStateOnClick: function(clickedTile) {
        switch(this.gameState) {
            case 'selectToken':
                if(this._isValidSelect(clickedTile)) {
                    this._selectActiveToken(clickedTile.occupiedBy);
                    this._setGameState('moveToken');
                }
                break;
            case 'moveToken':
                if(this._isValidMove(this.activeToken, clickedTile)) {
                    var wasPromoted = JSON.parse(JSON.stringify(this.activeToken.isPromoted));
                    this._makeMove(this.activeToken, clickedTile);
                    if(this.forcedCapture && this._hasCaptureMove(this.activeToken) && (wasPromoted === this.activeToken.isPromoted))
                        this._setGameState('moveTokenAgain');
                    else
                        this._setGameState('endTurn');
                    break;
                }
                else {
                    this._deselectActiveToken(this.activeToken);
                    this._setGameState('selectToken');
                }
                break;
            case 'moveTokenAgain':
                if(this._isValidMove(this.activeToken, clickedTile)) {
                    var wasPromoted = JSON.parse(JSON.stringify(this.activeToken.isPromoted));
                    this._makeMove(this.activeToken, clickedTile);
                    if(this.forcedCapture && this._hasCaptureMove(this.activeToken) && (wasPromoted === this.activeToken.isPromoted))
                        this._setGameState('moveTokenAgain');
                    else
                        this._setGameState('endTurn');
                    break;
                }
                break;
            default:
                console.log('No Action on State : ', this.gameState);
        }
    },

    _isGameOver: function() {
        if(this.turnCounter === this.turnLimit) return true;
        if(this.activePlayer === 1) {
            if(this._hasNoMove(2))
                return true;

        }
        else {
            if(this.activePlayer === 2)
                if(this._hasNoMove(1))
                    return true;
        }
        return false;
    },

    _hasAnyMove: function(token) {
        return (this._hasCaptureMove(token) || this._hasNormalMove(token));
    },

    _hasNoMove: function(player) {
        var returnVal = true;
        var that = this;
        this.playerTokens[player].forEach(function(token) {
            if(that._hasAnyMove(token)) {
                returnVal = false;
            }
        })
        return returnVal;
    },

    _gameOver: function() {
        if(this.turnCounter === this.turnLimit)
            this._endGame('draw');
        if(this.activePlayer === 1) {
            if(this._hasNoMove(2))
                return this._endGame('over', 1);

        }
        else {
            if(this.activePlayer === 2)
                if(this._hasNoMove(1))
                    return this._endGame('over', 2);
        }
        return false;
    },

    _endTurn: function() {
        if(this._isGameOver())
            this._gameOver();
        else {
            if (this.activePlayer === 1)
                this._activatePlayer(2);
            else
                this._activatePlayer(1);
        }
    },

    _endGame: function(state, winner) {
        // kapow.invokeRPC('postScore', {"score": this.score}, function() {
        //     console.log("Success Posting Score");
        // }, function(error) {
        //     console.log("Failure Posting score", error);
        // });
        // this.gameEndText = TextUtil.createText(this.game, {
        //     positionX: this.world.centerX,
        //     positionY: 560,
        //     message: "Game Over",
        //     align: "center",
        //     backgroundColor: "#000000",
        //     fill: "#fefefe",
        //     font: 'nunito-regular',
        //     fontSize: "80px",
        //     fontWeight: 800,
        //     wordWrapWidth: 355,
        //     anchorX: 0.5,
        //     anchorY: 0
        // });
        // this.game.stage.addChild(this.gameEndText);
        // // this._createPlayButton();
        // this._drawScoreboard();
    },

    endGame: function() {
		this.hasGameStarted = false;
		this.nextTap.setText("!");

		var obj = {
			"time" : this.endTime - this.startTime
		};
		kapow.invokeRPC('postScore', obj, function() {
			console.log("Posted score successfully!");
		}, function(error) {
			console.log("Error while posting score ", error);
		});
	}

}
