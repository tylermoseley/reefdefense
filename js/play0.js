playState0 = {

    preload: function() {
        game.load.tilemap('Map2', 'Assets/Map/Map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
    },

    create: function () {
        game.add.plugin(Phaser.Plugin.Debug);

        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});

        map = game.add.tilemap('Map2');
        map.addTilesetImage('Water');

        layer = map.createLayer('Tile Layer 1');
        layer.resizeWorld();

        //  hover box
        marker = game.add.graphics();
        marker.lineStyle(2, "0xFFFFFF", 1);
        marker.drawRect(0, 0, 32, 32);

        // call updateMarker when mouse is moved
        game.input.addMoveCallback(updateMarker, this);

        // call getTileProperties function when tile is clicked
        game.input.onDown.add(clickHandler, this);

        // set cursors variable to keyboard cursor input
        cursors = game.input.keyboard.createCursorKeys();

        wasd = {
            w: game.input.keyboard.addKey(Phaser.Keyboard.W),
            s: game.input.keyboard.addKey(Phaser.Keyboard.S),
            a: game.input.keyboard.addKey(Phaser.Keyboard.A),
            d: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        // mouseWheel to capture scrolling for alternate movement
        // up/down only in phaser <3.2*
        // mouseWheel = game.input.mouseWheel;

    },

    update: function() {

        // move camera with cursors with "speed" set
        // (setting to factors of 32 makes it hard to see movement)
        scrollSpd = 8
        if (cursors.left.isDown || wasd.a.isDown) {
            game.camera.x -= scrollSpd;
        } else if (cursors.right.isDown || wasd.d.isDown) {
            game.camera.x += scrollSpd;
        }
        if (cursors.up.isDown || wasd.w.isDown) {
            game.camera.y -= scrollSpd;
        } else if (cursors.down.isDown || wasd.s.isDown) {
            game.camera.y += scrollSpd;
        }

        // resting animation on for all corals on gameBoard
        for(i=0; i<=31; i+=1) {
            for(j=0; j<=31; j+=1) {
                if (typeof gameBoard[i][j] === 'object') {
                    if (gameBoard[i][j].id.slice(0, 1) === "c") {
                        gameBoard[i][j].sprite.animations.play("ripple", 4, true)
                    }
                }
            }
        }

    }
}

// create empty 32x32 gameBoard (maybe add dimension variable if board size change)
gameBoard = [];
for (i=0; i<=31; i++) {
    gameBoard.push([])
    for (j=0; j<=31; j++){
        gameBoard[i].push("None")
    }
}
// initialize corals list and coralid index sequence
coralid = "c0"

class Coral {
    constructor (id) {
        this.id = id;
    }
    locate (tile, gameBoard) {
        // there is nothing on gameBoard, place coral object
        // add currency check here later
        if (gameBoard[tile.x][tile.y] === "None") {
            this.sprite = game.add.sprite(tile.worldX, tile.worldY, "bubble")
            this.sprite.animations.add("ripple", [0,3])
            gameBoard[tile.x][tile.y] = this
            return 1;
        // no coral is added for now, change for conflict resolution
        } else if (gameBoard[tile.x][tile.y] !== "None") {
            return 0;
        }
    }
}

// main handler for mouse clicks
function clickHandler() {
    pointerX = layer.getTileX(game.input.activePointer.worldX);
    pointerY = layer.getTileY(game.input.activePointer.worldY);
    tile = map.getTile(pointerX, pointerY, layer);

    // create new coral object in corals list under pointer
    // add type for property for diff corals later
    tempCoral = new Coral(
        id = coralid
    );

    // locate coral with curent id to game board (increment coralid with prefix if success)
    if ( tempCoral.locate(tile, gameBoard) ) {coralid = coralid.slice(0,1) + (Number(coralid.slice(1)) + 1)};

    game.debug.text(coralid, 12, 36)
    game.debug.text("Tile: world: {"+tile.worldX+","+tile.worldY+"} index: ("+tile.x+","+tile.y+")", 12, 16);

}

// display rectangle on mouse location
function updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
}