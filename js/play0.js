playState0 = {

    preload: function() {
        game.load.tilemap('Map0', 'Assets/Map/Map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
        game.load.spritesheet('Crab', 'Assets/spritesheets/crabSheet.png', 320, 320)
        game.load.image('sand', 'Assets/Tilesets/sand.png');
        game.load.image('caveleft', 'Assets/Tilesets/caveleft.png');
        game.load.image('caveright', 'Assets/Tilesets/caveright.png');
        game.load.image('cavetop', 'Assets/Tilesets/cavetop.png');
        game.load.image('cavebottom', 'Assets/Tilesets/cavebottom.png');
    },

    create: function () {

        game.add.plugin(Phaser.Plugin.Debug);

        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});

        map = game.add.tilemap('Map0');
        map.addTilesetImage('Water');
        map.addTilesetImage('sand');
        map.addTilesetImage('caveleft');
        map.addTilesetImage('caveright');
        map.addTilesetImage('cavetop');
        map.addTilesetImage('cavebottom');

        SandBottom = map.createLayer('SandBottom');
        WaterEdgesMid = map.createLayer('WaterEdgesMid');
        layer = map.createLayer('PathsTop');
        layer.resizeWorld();

        // center camera
        game.camera.x = ((32**2-game.width)/2);
        game.camera.y = ((32**2-game.height)/2);

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

        game.add.sprite((32**2/2)-40, (32**2/2)-40, "clam")

        // mouseWheel to capture scrolling for alternate movement
        // up/down only in phaser <3.2*
        // mouseWheel = game.input.mouseWheel;


        //added a start level button
        startButton = game.add.button(380, 310, 'start', startLevel, this, 2, 1, 0);
        startButton.fixedToCamera = true;
        startButton.anchor.setTo(0.5, 0.5)
        startButton.scale.setTo(0.2,0.2)

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

        checkCoral();

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
previousCoralID = coralid

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

function checkCoral(){

    if (previousCoralID !== coralid) {
        startButton = game.add.button(380, 310, 'start', startLevel, this, 2, 1, 0);
        startButton.fixedToCamera = true;
        startButton.anchor.setTo(0.5, 0.5)
        startButton.scale.setTo(0.2,0.2)

        previousCoralID = coralid
    }
}

// display rectangle on mouse location
function updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
}

// level start funciton
function startLevel() {
    console.log('started')

    speed = 1

    crab = game.add.sprite(100, 512, 'Crab')
    crab.anchor.setTo(0.5, 0.5);
    crab.scale.setTo(-0.2, 0.2);

    game.physics.enable(crab);

    crab.animations.add('walk', [0,1,2,3,4,5]);
    crab.animations.play('walk', 18, true);

    
    
}

function crabMove(crab, speed) {
    crab.x += speed
}