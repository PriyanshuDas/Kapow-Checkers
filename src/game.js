// 'use strict';
//
// import Planet from "../objects/widgets/sprites/Planet";
// import SpaceShip from "../objects/widgets/images/SpaceShip";
// import Shoot from "../objects/Widgets/sprites/Shoot";
// import GAME_CONST from "../const/GAME_CONST";
// import Meteor from "../objects/widgets/sprites/Meteor";
// import TextUtil from "../util/TextUtil";
// import PlayButton from "../objects/widgets/buttons/PlayButton";


/*Notes :
        Represent the tiles as a 2D array with rows and columns:
        0|   1   |   2   |   3   |   4   |   5   |   6   |   7   |   8   |
        ----------------------------------------------------------------
        1|  1,1  |  1,2  | 1,3   | 1,4   |  1,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        2|  2,1  |  2,2  | 2,3   | 2,4   |  2,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        3|  3,1  |  3,2  | 3,3   | 3,4   |  3,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        4|  4,1  |  4,2  | 4,3   | 4,4   |  4,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        5|  5,1  |  5,2  | 5,3   | 5,4   |  5,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        6|  6,1  |  6,2  | 6,3   | 6,4   |  6,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        7|  7,1  |  7,2  | 7,3   | 7,4   |  7,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------
        8|  8,1  |  8,2  | 8,3   | 8,4   |  8,5  |  1,6  |  1,7  |  1,8  |
        ----------------------------------------------------------------

        For every valid tile, have several values:

        occupiedBy: null or p1 or p2
        isSelected: true or false
        setofUpwardsMoves:
        setofDownWardMoves:


    Entities:

        1. Tiles
            - (row, col)
            - AdjacentTiles {direction, Tile}
            - occupiedBy: {Token}

        2. Tokens
            - Player : {player}
            - onTile: {Tile}
            - isPromoted: {True/False}

    Interactions:
        1. Player X Turn:
            - Set this.activePlayer = X
            - Check for all tokens of player X whether a capture is possible
            - If any capture is possible, set global this.forcedCapture = true
            - Go into 'waiting to select token' state.       [How?]

        2. Selecting a Tile:
            - state: 'selectToken'
            - Go through i/o to identify which tile is clicked on, retrieve that tile
            - If the tile selection is valid (check if forcedCapture, etc.), then highlightValidMoves(token/tile)
                - Set state to 'waiting for move', and selected tile to Tile1

        3. Selecting a place to move to         'waiting for move' (State)
            - state: 'MoveToken'
            - Go through i/o to identify which tile is clicked on:
                - If invalid click, then set state to 'waiting to select token'
                - If valid click, call _selectTiletoMove(Tile2)
                    -> In _selectTiletoMove(tile), have a check to see (for 'american')
                        -> If forceCapture === true, and Token.isPromoted === false && _isOnKingsRow(Token)
                            -> _promoteToken(Token)
                            -> set State to 5

                - setState to 'madeFirstMove'
                - set selectedTile to Tile2

        4. If(this.forcedCapture == true) Check if anymore moves are possible
            - 'selectMove2'
            - Call _checkContinuedMove(Tile2)
            - If true, then highlightValidMove(Tile2)
            - Go through i/o to identify which tile is clicked on
            - If valid move then call _selectTileToMove(Tile3)
                - set state to 'madeFirstMove'
                - set selectedTile to Tile3
                - go To 4 again
            - If no valid moves possible, go to state 5.

        5. Call finishTurn(X)
            - Switches Player

        _selectTileToMove(Tile) => Should Check for promotion

        _promote(Token)

        _setOfValidMoves(Token)

         If !Token.isPromoted
                                => If player is 1, then move only Down
                                => If player is 2, then move only Up
         Else can move anywhere


         this.lastClickedTile keeps track of which tile was last clicked on

         ToDo (Priyanshu):
         1. makeMove
         2. endTurn
         3. _getAvailableMoveTiles(token)
         4. capture(token1, token2)
         5. setState

         ToDo: (Sahil):
         1. highlightTile
         2. unHighlightTile
         3. TokenAnimations(idle, capture, defeated)
         4.
*/

export class Play extends Phaser.State {
    preload() {
        console.log("Preloading Play State");
        this.spaceShipThrust = GAME_CONST.SPEED.SPACE_SHIP;
        this.centerPoint = new Phaser.Point(this.world.centerX, this.world.centerY);
        this.game.physics.arcade.checkCollision.down = false;
        this.game.physics.arcade.checkCollision.up = false;
        this.game.physics.arcade.checkCollision.right = false;
        this.game.physics.arcade.checkCollision.left = false;
        this.lastTimeStamp = Date.now();
        this.difficulty = 1000;
        this.score = 0;
    }

    create() {
        this.inputAllowed = false;
        this.lastClickedTile = null;
        this._setBoardStyle('american');
        this._setupBoardGraph();
        this._initializeTokens();

        //Assumes Both players are human on the same device
        this._createStartState({1: true, 2: true});

        // this._createScoreText();
        // // this.game.physics.arcade.gravity.y = 980;
        // this.game.input.onTap.add(this._changeShipDirection, this);
        // this.projectiles = this.game.add.group();
        // this.meteors = this.game.add.group();
        // this.game.stage.addChild(this.projectiles);
        // this.game.stage.addChild(this.meteors);
    }

    update() {
        if(this.healthMetric > 0) {
            this.spaceShip.rotation += this.spaceShipThrust;
            this.meteors.forEach(this.game.physics.arcade.moveToObject,this.game.physics.arcade, false, this.planet, 200);
            if (Date.now() - this.lastTimeStamp > this.difficulty) {
                let position;
                let prob = Math.random();
                if (prob < 0.25) {
                    position = new Phaser.Point(Math.random() * 1080, -256);
                }
                else if(prob < 0.5) {
                    position = new Phaser.Point(1080 + 256, 1920 * Math.random());
                }
                else if(prob < 0.75) {
                    position = new Phaser.Point(1080 * Math.random(), 1920 + 256);
                }
                else {
                    position = new Phaser.Point(-256, 1920 * Math.random());
                }
                let meteor = new Meteor({
                    game: this.game,
                    posX: position.x,
                    posY: position.y,
                    label: 'meteor',
                    angle: position.angle(this.centerPoint, true),
                    anchorX: 0.5,
                    anchorY: 0.5
                });
                this.meteors.add(meteor);
                this.lastTimeStamp = Date.now();
            }
            this.game.physics.arcade.collide(this.meteors, this.planet, function(planet, meteor) {
                meteor.destroy();
                this.healthMetric-=12.5;
                this._decreaseHealth();
                window.navigator.vibrate(1000);
                if(this.healthMetric <= 0 ) {
                    this._endGame();
                }
                this.game.camera.shake(0.005, 500);
            }, null, this);
            this.game.physics.arcade.collide(this.meteors, this.projectiles, function(shoot, meteor) {
                meteor.kill();
                shoot.kill();
                this.score+=1;
                this._changeScore();
            }, null, this);
        }
    }

    shutdown() {
        for (let i = this.game.stage.children.length - 1; i >= 0; i--) {
            this.game.stage.removeChild(this.game.stage.children[i]);
        }
    }

    _createScoreText() {
        this.scoreText = TextUtil.createText(this.game, {
            positionX: 100,
            positionY: 100,
            message: this.score,
            align: "center",
            backgroundColor: "#000000",
            fill: "#fefefe",
            font: 'nunito-regular',
            fontSize: "60px",
            fontWeight: 800,
            wordWrapWidth: 355,
            anchorX: 0.5,
            anchorY: 0
        });
        this.game.stage.addChild(this.scoreText);
    }

    _setBoardStyle(style) {
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
    }

    _setupBoardGraph() {
        this.playableTiles = {};
        var i = 1, j = 1;
        for(i = 1; i <= this.rows; i++)
            for(j = 1; j <= this.cols; j++) {
                if((i+j)%2 === 1) {
                    var curTile = {};
                    curTile.row = i;
                    curTile.col = j;
                    curTile.occupiedBy = null;
                    this.playableTiles[i][j].push(curTile);
                }
            }

        for(i = 1; i <= this.rows; i++)
            for(j = 1; j <= this.cols; j++) {
                if((i+j)%2 === 1) {
                    var curTile = this.playableTiles[i][j];
                    var adjacentTiles = [];
                    var dx = [-1, -1, +1, +1];
                    var dy = [-1, +1, -1, +1];

                    for(var x = 0; x < 4; x++) {
                        for(var y = 0; y < 4; y++) {
                            var newX = i+dx[x];
                            var newY = i+dy[y];
                            var vertical = (dx[x] < 0)?'Up':'Down';
                            var horizontal = (dy[y] < 0)?'Left':'Right';
                            var direction = vertical+horizontal;
                            var adjacentTile = {};
                            adjacentTile.direction = direction;
                            adjacentTile.tile = null;
                            if(newX > 0 && newX <= 8 && newY > 0 && newY <= 8)
                                adjacentTile.tile = this.playableTiles[newX][newY];
                            adjacentTiles.push(adjacentTile);
                        }
                    }
                    this.playableTiles[i][j].adjacentTiles = adjacentTiles;
                }
            }

    }

    _initializeTokens() {
        this.playerTokens = {};
        for (var i = 1; i <= 2; i++)
        {
            this._createPlayerTokens(i);
            this._placePlayerTokens(i);
        }
    }

    _createPlayerTokens(player) {
        this.playerTokens[player] = [];

        for(var i = 0; i < this.initialTokens; i++) {
            var token = {};
            token.isPromoted = false;
            token.player = player;
            this.playerTokens[player].push(token);
        }
    }

    /*
        Place Player Tokens. Keep placing tokens from the first (row, col) till all placed
     */
    _placePlayerTokens(player) {
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
    }

    /*
        Update Tile at (x, y) to know what occupies it,
        Update Token to notify that it occupies tile (x, y)
     */
    _placeTokenAt(token, x, y) {
        token.onTile = this.playableTiles[x][y];
        this.playableTiles[x][y].occupiedBy = token;
    }

    _createStartState(humans){
        this.isHuman = humans;
        this._activatePlayer(1);
    }

    //ToDo: Sahil and Priyanshu
    _registerInput(x, y) {
        if(!this.inputAllowed)  return;
        this.lastClickedTile = this.playableTiles[x][y];
        this._updateStateOnClick(this.lastClickedTile);
    }

    _swapTurns() {

    }

    _activatePlayer(player) {
        this.activePlayer = player;
        this.gameState = 'selectToken';
        this.forcedCapture = this._checkForcedCapture();
        this._enableInput(player);
    }

    _enableInput(player) {
        if(this.isHuman[player]) {
            this.inputAllowed = true;
        }
    }

    _checkForcedCapture() {
        var returnValue = false;

        //can use for loop here for efficency (not a great increase)
        this.playerTokens[1].forEach(function(token){
            if(this._hasCaptureMove(token)) {
                returnValue = true;
            }
        });
        return returnValue;
    }

    _hasCaptureMove(token) {
        var curTile = token.onTile;
        var adjacentTiles = curTile.adjacentTiles;
        var that = this;
        var returnValue = false;
        adjacentTiles.forEach(function(adjTile) {
           if(adjTile.tile !== null && that._isValidCapture(token.onTile, adjTile.tile)) {
               returnValue = true;
           }
        });
        return returnValue;
    }

    //Checks whether token on tile1 can valid capture token on tile2

    _isValidCapture(tile1, tile2) {
        var dx = tile2.row - tile1.row;
        var dy = tile2.col - tile1.col;
        var token1 = tile1.occupiedBy;
        var token2 = tile2.occupiedBy;

        if(token1 === null || token2 === null || token1.player === token2.player || token1.player !== this.activePlayer)
            return false;

        if(!token1.isPromoted && token1.player === 1 && dx < 0) return false;
        if(!token1.isPromoted && token1.player === 2 && dx > 0) return false;


        var newX = tile1.row + 2*dx;
        var newY = tile1.col + 2*dy;

        if(typeof this.playableTiles[newX][newY] === 'undefined') return false;

        if(this.playableTiles[newX][newY].occupiedBy === null) return true;

        return false;

    }

    _isValidMove(token, tile) {

    }

    _makeMove(token, tile) {

    }

    _captureToken(token1, token2) {

    }

    _isValidSelect(tile) {
        return (tile.occupiedBy === this.activePlayer);
    }

    _selectActiveToken(token) {
        this.activeToken = token;
        this._highlightAvailableMoves(token);
        this._highlightTile(token.onTile, true, 'selected');
    }

    _deselectActiveToken(token) {
        this.activeToken = null;
        this._unHighlightAvailableMoves(token);
        this._highlightTile(token.onTile, false);
    }
    _highlightTile(tile, type) {
        //ToDo: Sahil
    }

    _unHighlightTile(tile) {
        //ToDo: Sahil
    }

    _highlightTiles(arrayOfTiles, activate, type) {
        var that = this;
        arrayOfTiles.forEach(function(tile) {
            if(activate) that._highlightTile(tile, type);
            else         that._unHighlightTile(tile);
        })
    }

    _unHighlightAvailableMoves(token) {
        this._highlightTiles(this.availableMoves, false);
        this.availableMoves = null;
    }

    _highlightAvailableMoves(token) {
        var availableTiles = this._getAvailableMoveTiles(token);
        this.availableMoves = availableTiles;
        this._highlightTiles(availableTiles, true, 'canMove');

    }

    //ToDo: Priyanshu
    _getAvailableMoveTiles(token) {

    }

    _setGameState(state) {
        this.gameState = state;
        switch(state) {
            case 'selectToken':
                this.availableMoves = {};
                this.activeToken = null;
                break;
            case 'moveToken':
                break;
        }
    }

    _updateStateOnClick(clickedTile) {
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
                    if(this.forcedCapture && this._canMakeAnotherJump(this.activeToken) && (wasPromoted === this.activeToken.isPromoted))
                        this._setGameState('moveTokenAgain');
                    else
                        this._setGameState('endTurn');
                    break;
                }
                break;
            default:
                console.log('UnknownState!');
        }
    }

    _endGame() {
        // kapow.invokeRPC('postScore', {"score": this.score}, function() {
        //     console.log("Success Posting Score");
        // }, function(error) {
        //     console.log("Failure Posting score", error);
        // });
        this.gameEndText = TextUtil.createText(this.game, {
            positionX: this.world.centerX,
            positionY: 560,
            message: "Game Over",
            align: "center",
            backgroundColor: "#000000",
            fill: "#fefefe",
            font: 'nunito-regular',
            fontSize: "80px",
            fontWeight: 800,
            wordWrapWidth: 355,
            anchorX: 0.5,
            anchorY: 0
        });
        this.game.stage.addChild(this.gameEndText);
        // this._createPlayButton();
        this._drawScoreboard();
    }

    _createPlayButton() {
        this.playButtton = new PlayButton({
            game: this.game,
            posX: this.world.centerX,
            posY: this.world.centerY,
            label: 'playGame',
            anchorX: 0.5,
            anchorY: 0.5,
            callback: this.shutdown
        });
        this.game.stage.addChild(this.playButtton);
    }

    _drawScoreboard() {
        this.scoreboard = this.game.add.button(this.game.world.centerX, 1800, "scoreboard", this._renderScoreboard, this);
        this.scoreboard.anchor.setTo(0.5, 0);
        this.game.stage.addChild(this.scoreboard);
    }

    _renderScoreboard() {
        kapow.boards.displayScoreboard({
            "metric":"score",
            "interval":"daily"
        });
    }
}