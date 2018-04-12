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
        this._setupBoardGraph();
        this._placeTokens();
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

    _setupBoardGraph() {
        this.playableTiles = {};
        var i = 1, j = 1;
        for(i = 1; i <= 8; i++)
            for(j = 1; j <= 8; j++) {
                if((i+j)%2 === 0) {
                    var curTile = {};
                    curTile.row = i;
                    curTile.col = j;
                    this.playableTiles[i][j].push(curTile);
                }
            }

        for(i = 1; i <= 8; i++)
            for(j = 1; j <= 8; j++) {
                if((i+j)%2 === 0) {
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

    _placeTokens() {

    }

    _createStartState(){

    }

    _registerInput() {

    }

    _createBoard() {

    }

    _createTokens() {

    }

    _createPlayerOneTokens() {

    }

    _createPlayerTwoTokens() {

    }

    _swapTurns() {

    }

    _activatePlayer(player) {

    }

    _setOfForcedCaptureTokens() {

    }

    _selectTileForPiece(row, col) {

    }

    _isValidSelectionForPiece(row, col) {

    }

    _setOfMovesPossible(row, col) {

    }

    _selectTileToMove(row, col) {

    }

    _isValidTileToMove(row, col) {

    }

    _makeMove(row1, col1, row2, col2) {

    }

    _canMakeAnotherJump (row, col) {

    }

    _forceActiveTile(row, col) {

    }

    _captureToken(row, col) {

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