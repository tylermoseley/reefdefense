var bullet, gameOver = 0
playState0 = {
    preload: function() {
        game.load.tilemap('Map0', 'Assets/Map/Map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
        game.load.image('sand', 'Assets/Tilesets/sand.png');
        game.load.image('caveleft', 'Assets/Tilesets/caveleft.png');
        game.load.image('caveright', 'Assets/Tilesets/caveright.png');
        game.load.image('cavetop', 'Assets/Tilesets/cavetop.png');
        game.load.image('cavebottom', 'Assets/Tilesets/cavebottom.png');
        game.load.spritesheet('Crab', 'Assets/spritesheets/crabSheet.png', 320, 320);
        game.load.spritesheet('Bullet', 'Assets/spritesheets/bullet.png', 32, 64);
        game.load.spritesheet('Clam', 'Assets/spritesheets/clam.png', 64, 64);
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

        // add clam to center on load
        clam = game.add.sprite(512 - 32, 512-45, "Clam");
        clam.animations.add('Resting', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        clam.animations.play('Resting', 18, true)
        clam.scale.setTo(1.1, 1.1)
        game.physics.enable(clam);


        // mouseWheel to capture scrolling for alternate movement
        // up/down only in phaser <3.2*
        // mouseWheel = game.input.mouseWheel;


        //added a start level button
        startButton = game.add.button(380, 310, 'start', startLevel, this, 2, 1, 0);
        startButton.fixedToCamera = true;
        startButton.anchor.setTo(0.5, 0.5);
        startButton.scale.setTo(0.2,0.2);

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(500, 'Bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', 0.25);

        // for creating the waves
        // crabs = game.add.group();
        // crabs.enableBody = true;
        // crabs.physicsBodyType = Phaser.Physics.ARCADE;
        // crabs.createMultiple(500, 'crab');
        // crabs.setAll('anchorx', 0.5);
        // crabs.setAll('anchory', 0.5);
        // crabs.setAll('scalex', -0.2)
        // crabs.setAll('scaley', 0.2)


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
        for (i = 0; i <= 31; i += 1) {
            for (j = 0; j <= 31; j += 1) {
                if (typeof gameBoard[i][j] === 'object') {
                    if (gameBoard[i][j].id.slice(0, 1) === "c") {
                        if (defending) {
                            gameBoard[i][j].seekEnemies(crab, bullets)
                        } else {
                            gameBoard[i][j].resting();
                        }
                        // game.physics.arcade.overlap(gameBoard[i][j].sprite, crab, collectStar, null, this);
                    }
                }
            }
        }

        if(defending & gameOver == 0) {
            crabMove(crab, 0.25)
            game.physics.arcade.overlap(bullet, crab, crabHit)
            game.physics.arcade.overlap(crab, clam, clamHit)
        }
    }
}

// this will change once enemy groups implemented.
async function crabHit () {
    bullet.kill();
    crab.tint = 0x000000;
    await sleep(0.2);
    crab.tint = 0xFFFFFF;
}

function clamHit () {
    clam.kill();
    GOText = game.add.text(game.camera.x, game.camera.y, 'Game Over', {font: '55px Courier', fill: '#fff'});
    GOText.fixedToCamera = true;
    gameOver = 1
}

class Coral {
    constructor (id, type) {
        this.id = id
        this.type = type
        switch (this.type) {
            case 1:
                this.range = 64;
                break;
            case 2:
                this.range = 128;
                break;
            case 3:
                this.range = 256;
                break;
        }
        this.nextFire = 0
        this.fireRate = 400
        // this.bullet = bullets.getFirstDead();
    }
    locate (tile, gameBoard) {
        // there is nothing on gameBoard, place coral object
        // add currency check here later
        // tile == null means there is no water on the mid layer
        if (tile == null){
            return 0;
        } else if (gameBoard[tile.x][tile.y] === "None") {
            this.sprite = game.add.sprite(tile.worldX, tile.worldY, "bubble")
            game.physics.enable(this.sprite);
            this.sprite.animations.add("ripple", [0,3])
            gameBoard[tile.x][tile.y] = this
            this.x = tile.x
            this.y = tile.y
            this.worldX = tile.worldX
            this.worldY = tile.worldY
            return 1;
        // no coral is added for now, change for conflict resolution
        } else if (gameBoard[tile.x][tile.y] !== "None") {
            return 0;
        }
    }
    resting () {
        this.sprite.animations.play("ripple", 4, true)
    }
    seekEnemies (crab, bullets) {
        this.crabDistance = Phaser.Math.distance(
            this.sprite.centerX,
            this.sprite.centerY,
            crab.centerX,
            crab.centerY)
        if (this.crabDistance < this.range) {
            this.sprite.animations.paused = true;
            this.fire(crab, bullets);
        } else {
            this.sprite.animations.play("ripple", 4, true)
        }
    }
    fire (crab, bullets) {
        if (game.time.now > this.nextFire) {
            this.nextFire = game.time.now + this.fireRate;
            bullet = bullets.getFirstDead();
            // this.bullet.anchor.setTo(0.25)
            bullet.reset(this.sprite.centerX, this.sprite.centerY);
            game.physics.arcade.moveToObject(bullet, crab, 200);
            bullet.rotation = game.physics.arcade.angleToXY(bullet, crab.centerX, crab.centerY)
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
defending = 0

// main handler for mouse clicks
function clickHandler() {
    pointerX = SandBottom.getTileX(game.input.activePointer.worldX);
    pointerY = SandBottom.getTileY(game.input.activePointer.worldY);
    tile = map.getTile(pointerX, pointerY, SandBottom);

    waterpointerX = WaterEdgesMid.getTileX(game.input.activePointer.worldX);
    waterpointerY = WaterEdgesMid.getTileY(game.input.activePointer.worldY);
    watertile = map.getTile(pointerX, pointerY, WaterEdgesMid);

    // create new coral object in corals list under pointer
    // add type for property for diff corals later
    tempCoral = new Coral(
        id = coralid,
        type = 2
    );


    // locate coral with curent id to game board (increment coralid with prefix if success)
    if ( tempCoral.locate(watertile, gameBoard) ) {coralid = coralid.slice(0,1) + (Number(coralid.slice(1)) + 1)};

    game.debug.text(coralid, 12, 36)
    game.debug.text("Tile: world: {"+tile.worldX+","+tile.worldY+"} index: ("+tile.x+","+tile.y+")", 12, 16);

    startButton.bringToTop();
}

// display rectangle on mouse location
function updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
}

// sleep function
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}

// level start function
async function startLevel() {
    startButton.destroy();
//code to add countdown counter for enemy waves
    // countdown = game.add.text(game.camera.x+100, game.camera.y+200, 'Starting in ... 3', {font: '55px Courier', fill: '#fff'});
    // await sleep(1);
    // countdown.text = "Starting in ... 2"
    // await sleep(1);
    // countdown.text = "Starting in ... 1"
    // await sleep(1);
    // countdown.text = "Defend!"
    // await sleep(1);
    // countdown.destroy();

    speed = 1
    defending = 1

    crab = game.add.sprite(16, 512, 'Crab')
    game.physics.enable(crab)
    crab.anchor.setTo(0.5, 0.5);
    crab.scale.setTo(0.2, 0.2);

    crab.animations.add('walk', [0,1,2,3,4,5]);
    crab.animations.play('walk', 18, true);
    
}

function crabMove(crab, speed) {
    crab.x += speed
}