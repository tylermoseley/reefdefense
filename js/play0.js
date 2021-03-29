var bullet, gameOver=0, towertype=1, snd, coralid="c0", defending=0, gameBoard=[], nextWave, WaveCount = 0, finalWaveCount = 1
// create empty 32x32 gameBoard (maybe add dimension variable if board size change)
for (i=0; i<=31; i++) {
    gameBoard.push([])
    for (j=0; j<=31; j++){
        gameBoard[i].push("None")
    }
}

EnemyWaves = []
enemies = ['Crab', 'Eel', 'Jellyfish']
startLocations = ['top', 'bottom', 'left', 'right']

for (i=0; i<=30; i++) {
    wave = {
        enemyCount: i + 2,
        sprite: enemies[i % 3],
        speed: 10 + (i * 4),
        health: 2 + (i * 2), // must remain integers (no decimals here)
        spawnLocation: startLocations[Math.floor(Math.random() * 4)],
        spawnDelay: 3000,
        spawnCount: 0,
        killCount: 0
    }
    EnemyWaves.push(wave)
}
wave=0

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
        game.load.image('TXTbox', 'Assets/spritesheets/Textbox blue.png');
        game.load.spritesheet('Eel', 'Assets/spritesheets/eel.png', 90, 32);
        game.load.spritesheet('Jellyfish', 'Assets/spritesheets/jellyfish.png', 32, 32);
        game.load.audio("music", "Assets/audio/kv-ocean.mp3");
    },

    create: function () {
        BG_music = game.add.audio("music");
        BG_music.play("", 0, .2, true);
        // game.add.plugin(Phaser.Plugin.Debug);

        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});
        // tile map and layers
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

        // key presses
        wasd = {
            w: game.input.keyboard.addKey(Phaser.Keyboard.W),
            s: game.input.keyboard.addKey(Phaser.Keyboard.S),
            a: game.input.keyboard.addKey(Phaser.Keyboard.A),
            d: game.input.keyboard.addKey(Phaser.Keyboard.D),
        };
        towerKeys = {
            one: game.input.keyboard.addKey(Phaser.Keyboard.ONE),
            two: game.input.keyboard.addKey(Phaser.Keyboard.TWO),
            three: game.input.keyboard.addKey(Phaser.Keyboard.THREE),
        }

        // add clam to center on load
        clam = game.add.sprite(512 - 32, 512-45, "Clam");
        clam.animations.add('Resting', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        

        var ClamBubbles = game.add.audio("ClamBubbles");

        clam.scale.setTo(1.1, 1.1)
        game.physics.enable(clam);

        Clam(ClamBubbles);


        // mouseWheel to capture scrolling for alternate movement
        // up/down only in phaser <3.2*
        // mouseWheel = game.input.mouseWheel;
        

        //added a start level button
        startButton = game.add.button(380, 310, 'start', startLevel, this, 2, 1, 0);
        startButton.fixedToCamera = true;
        startButton.anchor.setTo(0.5, 0.5);
        startButton.scale.setTo(0.2,0.2);

        //shop
        shopbar = game.add.sprite(800, 0, 'shop_bar');
        shopbar.fixedToCamera = true;
        shopbar.anchor.setTo(1, 0)
        shopbar.scale.setTo(1,1)

        gold = game.add.sprite(755, 2, "gold");
        gold.fixedToCamera = true;
        gold.anchor.setTo(1,0)
        gold.scale.setTo(.035,.035)

        //money 
        moneyTXT = game.add.text(790, 5, balance, {font: "18px Arial", fill: "#000000", align: "left" });
        moneyTXT.fixedToCamera = true;
        moneyTXT.anchor.setTo(1,0)

        tower1_button = game.add.sprite(728, 38, 'tower1');
        tower1_button.fixedToCamera = true;
        tower1_button.anchor.setTo(0, 0);
        tower1_button.scale.setTo(0.8,0.8);

        tower1_cost = game.add.text(795, 40, "Press 1\n10G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower1_cost.fixedToCamera = true;
        tower1_cost.anchor.setTo(1,0)

        tower2_button = game.add.sprite(723, 80, 'tower2');
        tower2_button.fixedToCamera = true;
        tower2_button.anchor.setTo(0, 0);
        tower2_button.scale.setTo(.9, .9)

        tower2_cost = game.add.text(795, 80, "Press 2\n20G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower2_cost.fixedToCamera = true;
        tower2_cost.anchor.setTo(1,0)

        tower3_button = game.add.sprite(728, 123, 'tower3');
        tower3_button.fixedToCamera = true;
        tower3_button.anchor.setTo(0, 0);
        tower3_button.scale.setTo(0.8,0.8);

        tower3_cost = game.add.text(795, 125, "Press 3\n30G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower3_cost.fixedToCamera = true;
        tower3_cost.anchor.setTo(1,0)

        textbox = game.add.sprite(game.width/2 - 200, 10, "TXTbox");
        textbox.destroy()
        skipTXT = game.add.text(game.width/2  , 70, "",{font: "10px Arial", text: "bold()", fill: "#ffffff", align: "right"} )
        // create bullets group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(500, 'Bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', 0.25);

        WaveCounter = game.add.text(20, 20, "Wave: "+WaveCount+ "/"+finalWaveCount, {font: "30px Arial", text: "bold()", fill: "#ffffff", align: "center"});
        WaveCounter.fixedToCamera = true;

        

        nextPlacement = game.time.now
    },

    update: function() {
        // set tower type based on number keys
        if (towerKeys.one.isDown){
            towertype = 1
        }
        if (towerKeys.two.isDown){
            towertype = 2
        }
        if (towerKeys.three.isDown){
            towertype = 3
        }

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

        
        // resting state for all corals on gameBoard
        for (i = 0; i <= 31; i += 1) {
            for (j = 0; j <= 31; j += 1) {
                if (typeof gameBoard[i][j] === 'object') {
                    if (gameBoard[i][j].id.slice(0, 1) === "c") {
                        if (defending) {
                            gameBoard[i][j].seekEnemies(enemies, bullets)
                        } else {
                            gameBoard[i][j].resting();
                        }
                    }
                }
            }
        }
        
        // initial hard coding for enemy wave
        if(defending & gameOver == 0) {
            if (EnemyWaves[wave].killCount >= EnemyWaves[wave].enemyCount) {
                if(WaveCount > finalWaveCount){
                    win()
                }
                else{
                defending = 0
                wave++
                nextWave = game.time.now + 2000 // sadet delay until next wave
                }
            } else {
                WavePlacements(wave)
                game.physics.arcade.overlap(bullets, enemies, enemyHit)
                game.physics.arcade.overlap(enemies, clam, clamHit)
            }
        } else if (nextWave < game.time.now & nextWave !== 0) {
            nextWave = 0
            defending = 1
            WaveStart(wave)
        }

        
    }
}

async function Clam(ClamBubbles){
    while(true){
        clam.animations.play('Resting', 16)
        ClamBubbles.play();
        await sleep(8)
    }    
}

var balance = 100;
var prices = [10 , 20, 30]

// Enemy Hit
async function enemyHit (bullet, enemy) {
    bullet.kill()
    if (enemy.health == 1) {
        EnemyWaves[wave].killCount++
        if (enemy.key == 'Eel' || enemy.key == 'Jellyfish') {
            zap = game.add.audio('Zap', 0.3)
            zap.play()
        }
        else {
            crunch = game.add.audio('Crunch', 0.5)
            crunch.play()
        }
        balance+=5
        layerRise()
    }
    enemy.damage(1)

    enemy.tint = 0x000000
    await sleep(0.2);
    enemy.tint = 0xFFFFFF;
}

// game over event
function clamHit () {
    clam.kill();
    GOText = game.add.text(game.camera.x + 125, game.camera.y + 30, 'Game Over', {font: '55px Courier', fill: '#fff'});
    GOText.fixedToCamera = true;
    gameOver = 1
    var gameOverAudio = game.add.audio("GameOver")
    gameOverAudio.play();
    if (gameOver == 1){
        BG_music.pause();
        game.state.start("loss")
    }
    else{
        BG_music.resume();
    }
}

//Win event
function win(){
        game.state.start("win");
}
// coral class for coral objects
class Coral {
    constructor (id, type) {
        this.id = id
        this.type = type
        switch (this.type) {
            case 1:
                this.range = 64;
                this.spriteName = 'tower1'
                this.cost = prices[0]
                //added same sound for all towers for now on shoot, can swap easily later
                this.popSound = game.add.audio("PopSound")
                break;
            case 2:
                this.range = 128;
                this.spriteName = 'tower2'
                this.cost = prices[1]
                this.popSound = game.add.audio("PopSound")
                break;
            case 3:
                this.range = 256;
                this.spriteName = 'tower3'
                this.cost = prices[2]
                this.popSound = game.add.audio("PopSound")
                break;
        }
        this.nextFire = 0
        this.fireRate = 400
        this.closestEnemy = null
        this.moneyBag = game.add.audio("MoneyBag")
    }
    // locating coral method
    locate (tile, gameBoard) {
        // add currency check here later

        // tile == null means there is no water on the mid layer
        if (tile == null){
            return 0;
        // if there is nothing on gameBoard, place coral object
        } else if (gameBoard[tile.x][tile.y] === "None" && balance >= this.cost) {
            balance -= this.cost
            this.sprite = game.add.sprite(tile.worldX, tile.worldY, this.spriteName)
            game.physics.enable(this.sprite);
            this.sprite.animations.add("resting"+this.id, [0,1,2,3])
            this.sprite.animations.add("attacking"+this.id, [3,4,5,6])
            this.sprite.animations.play("resting"+this.id, 3, true)
            this.moneyBag.play();
            
            gameBoard[tile.x][tile.y] = this
            this.x = tile.x
            this.y = tile.y
            this.worldX = tile.worldX
            this.worldY = tile.worldY
            return 1;
        // if coral already exists,no coral is added for now, change for conflict resolution
        } else if (gameBoard[tile.x][tile.y] !== "None") {
            return 0;
        }
    }
    // resting animation
    resting () {
        this.sprite.animations.play("resting"+this.id, 3, true)
    }
    // seek out enemy in range and fire if so
    seekEnemies (enemies, bullets) {
        this.closestEnemy = enemies.getClosestTo(this.sprite)
        if (this.closestEnemy !== null) {
            this.enemyDistance = Phaser.Math.distance(
                this.sprite.centerX,
                this.sprite.centerY,
                this.closestEnemy.centerX,
                this.closestEnemy.centerY)
        }
        if (this.enemyDistance < this.range & this.closestEnemy !== null) {
            this.sprite.animations.play("attacking" + this.id, 12, true);
            this.fire(this.closestEnemy, bullets);
        } else {
            this.sprite.animations.play("resting" + this.id, 3, true);
        }
    }
    // fire bullets at crab at rate determined at construction of coral
    fire (enemy, bullets) {
        if (game.time.now > this.nextFire) {
            this.nextFire = game.time.now + this.fireRate;
            bullet = bullets.getFirstDead();
            bullet.reset(this.sprite.centerX, this.sprite.centerY);
            game.physics.arcade.moveToObject(bullet, enemy, 200);
            bullet.rotation = game.physics.arcade.angleToXY(bullet, enemy.centerX, enemy.centerY)
            this.popSound.play("", 0, .2);
        }
    }
}

// creates enemies group depending on wave details
function WaveStart(wave) {
    // Create Enemies Group For each wave
    WaveCount+=1;
    WaveCounter.setText("Wave: "+WaveCount+ "/"+finalWaveCount)
    enemies = null
    enemies = game.add.group() // sets new enemy wave
    enemies.enableBody = true
    enemies.physicsBodyType = Phaser.Physics.ARCADE
    enemies.createMultiple(EnemyWaves[wave].enemyCount, EnemyWaves[wave].sprite)

}

// called from upadate function to place enemies on delay if not total configured wave count not met
function WavePlacements(wave) {
    if ( (game.time.now > nextPlacement) & (EnemyWaves[wave].spawnCount < EnemyWaves[wave].enemyCount) ) {
        layerRise();
        
        nextPlacement = game.time.now + EnemyWaves[wave].spawnDelay // set spawn delay by wave
        enemy = enemies.getFirstDead()
        switch(EnemyWaves[wave].sprite){
            case 'Crab':
                enemy.scale.setTo(0.2, 0.2);
                enemy.animations.add('walk', [0,1,2,3,4,5]);
                enemy.animations.play('walk', 18, true);
                break;
            case 'Eel':
                enemy.animations.add('swim', [0,1,2,3,4,5,6,7,8,9,10,11])
                enemy.animations.play('swim', 12, true);
                break;
            case 'Jellyfish':
                enemy.scale.setTo(1.3, 1.3);
                enemy.animations.add('swim', [0,1,2,3,4,5,6,7])
                enemy.animations.play('swim', 8, true);
                break;
        }
        enemy.anchor.setTo(0.5, 0.5);
        
        switch (EnemyWaves[wave].spawnLocation) {
            case 'left':
                var spawnX = 32
                var spawnY = 512
                break
            case 'top':
                if (EnemyWaves[wave].sprite == 'Eel'){
                    enemy.angle = 90
                }
                var spawnX = 512
                var spawnY = 32
                break
            case 'right':
                if (EnemyWaves[wave].sprite == 'Eel'){
                    enemy.scale.setTo(-1,1);
                }
                var spawnX = 992
                var spawnY = 512
                break
            case 'bottom':
                if (EnemyWaves[wave].sprite == 'Eel'){
                    enemy.angle = 270
                }
                var spawnX = 512
                var spawnY = 992
                break
        }
        enemy.reset(spawnX + (Math.random()*48) - 24, spawnY + (Math.random()*24) - 16)  // set starting location with some variation.
        enemy.health = EnemyWaves[wave].health // set initial health by wave
        game.physics.arcade.moveToObject(enemy, clam, EnemyWaves[wave].speed) // set movement to clam
        EnemyWaves[wave].spawnCount++
    }
}


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
        type = towertype
    );


    // locate coral with curent id to game board (increment coralid with prefix if success)
    if ( tempCoral.locate(watertile, gameBoard) ) {coralid = coralid.slice(0,1) + (Number(coralid.slice(1)) + 1)};

    // game.debug.text(coralid, 12, 36)
    // game.debug.text("Tile: world: {"+tile.worldX+","+tile.worldY+"} index: ("+tile.x+","+tile.y+")", 12, 16);

    layerRise()

}

function layerRise() {
    moneyTXT.text = balance;
    // keep controls on top after building corals
    startButton.bringToTop();
    shopbar.bringToTop();
    gold.bringToTop();
    moneyTXT.bringToTop();
    tower1_button.bringToTop();
    tower1_cost.bringToTop();
    tower2_button.bringToTop();
    tower2_cost.bringToTop();
    tower3_button.bringToTop();
    tower3_cost.bringToTop();
    WaveCounter.bringToTop();
}

//same problem as before if i put the shop in a different function
/*
function shop_bar(){
    if (previousCoralID !== coralid){
        shopbar = game.add.sprite(800, 0, 'shop_bar');
        shopbar.fixedToCamera = true;
        shopbar.anchor.setTo(1, 0);
        shopbar.scale.setTo(1,1)

        moneyTXT = game.add.text(775, 20, "money", {font: "12px Arial", fill: "#000000", align: "left" });
        moneyTXT.fixedToCamera = true;
        moneyTXT.anchor.setTo(1,0)

        tower1_button = game.add.button(800, 40, 'tower1', startLevel, this, 2, 1, 0);
        tower1_button.fixedToCamera = true;
        tower1_button.anchor.setTo(1, 0);
        tower1_button.scale.setTo(.08,.08)

        previousCoralID = coralid
    }
}
*/
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
//     countdown = game.add.text(game.camera.x+100, game.camera.y+200, 'Starting in ... 3', {font: '55px Courier', fill: '#fff'});
//     await sleep(1);
//     countdown.text = "Starting in ... 2"
//     await sleep(1);
//     countdown.text = "Starting in ... 1"
//     await sleep(1);
//     countdown.text = "Defend!"
//     await sleep(1);
//     countdown.destroy();

    speed = 1
    defending = 1

    WaveStart(wave)
    
}
//when gameover, allows the game to restart
function restart(){
    game.state.start("play0")
}