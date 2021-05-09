playState0 = {
    preload: function() {
        gameOver=0, towertype=1, coralid="c0", defending=0, gameBoard=[], WaveCount = 0
        finalWaveCount = 15, nextLaser = 0, laserDelay = 5000, balance = 100
        nextWave = 0, bullet = null, laserFire = 0, sellMarker = "None", lastClickedTile = 'None'
        moneyCoral = 0, nextMiniboss = 4, buildMode = false, balance = 100, prices = [15 , 30, 45, 60]
        nextDirection = 0
      
        // create empty 32x32 gameBoard (maybe add dimension variable if board size change)
        for (i=0; i<=31; i++) {
            gameBoard.push([])
            for (j=0; j<=31; j++){
                gameBoard[i].push("None")
            }
        }
        EnemyWaves = []
        enemytypes = ['Crab', 'Eel', 'Jellyfish', 'Shark', 'Crab_Boss', 'Eel_Boss', 'Jellyfish_Boss']
        startLocations = ['left', 'top', 'right', 'bottom']

        for (i=0; i<=finalWaveCount; i++) {
            // every randomize every wave except waves divisible by 10
            if (i>0 & (i+1)%15 == 0) {
                // Shark Properties
                enemyCount = 1
                spriteIndex = 3
                speed = 15
                health = 300
                spawnLocation = [startLocations[0]]
                width = 224
                height = 64
            } else if (i>0 & (i+1)%4 == 0) {
                // Mini Boss Properties
                enemyCount = 1
                spriteIndex = nextMiniboss
                if (nextMiniboss < 6) {
                    nextMiniboss = nextMiniboss + 1
                } else {
                    nextMiniboss = 4
                }
                speed = 10

                if (nextMiniboss == 4) {
                    health = 100
                }

                else if (nextMiniboss == 5) {
                    health = 150
                }

                else {
                    health = 200
                }
                
                spawnLocation = [startLocations[nextMiniboss-4]]
                width = 64
                height = 64
            } else {
                // Other wave properties
                enemyCount = 2 + Math.floor(i * 1.5),
                spriteIndex = Math.floor(Math.random() * 3)
                //     spriteIndex = 1
                speed = 30 + (i * 5)
                health = 2 + (i * 2), // must remain integers (no decimals here)
                    directions = []
                    // directions = ['top', 'right', 'bottom', 'left']
                    dirStep = parseInt(i/3)
                    for (n=0; n<=dirStep; n++) {
                        directions.push(startLocations[Math.floor(Math.random() * 4)])
                    }
                    spawnLocation = directions
                width = 32
                height = 32
            }
            wave = {
                enemyCount: enemyCount,
                sprite: enemytypes[spriteIndex],
                speed: speed,
                health: health,
                spawnLocation: spawnLocation,
                spawnDelay: 2000,
                spawnCount: 0,
                killCount: 0,
                width: width,
                height: height
            }
            EnemyWaves.push(wave)
        }
        wave=0
        dummytower = new Coral(
            id = 99,
            type = 1,
        );
        game.load.tilemap('Map0', 'Assets/Map/Map0.json', null, Phaser.Tilemap.TILED_JSON);
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

        
        //range indicator (not yet finished)
        marker2 = game.add.graphics()
        //2nd value is alpha (opacity)
        marker2.beginFill("0xFFFFFF", 0.2);
        marker2.drawCircle(16, 20, dummytower.range*2);
        marker2.endFill();
        
        //  hover sprite
        marker = game.add.image(0,0, 'towertower', 0)
        marker.alpha = 0.5
    
        game.physics.enable(marker);

        //
        // hover box
        //marker = game.add.graphics();
        //marker.lineStyle(2, "0xFFFFFF", 1)
        //marker.drawRect(0, 0, 32, 32);
        //marker.drawRect(0, 0, 32, 32);

        // call updateMarker when mouse is moved
        game.input.addMoveCallback(updateMarker, this);
        
        //game.input.addMoveCallback(p, this);

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
            four: game.input.keyboard.addKey(Phaser.Keyboard.FOUR)
        };
        sell = {
            sell: game.input.keyboard.addKey(Phaser.Keyboard.DELETE)
        }
        pauseKeys = {
            p: game.input.keyboard.addKey(Phaser.Keyboard.P),
            shift: game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
            //quiting the game
            q: game.input.keyboard.addKey(Phaser.Keyboard.Q),
        }
        exitBuildMode = {
            esc: game.input.keyboard.addKey(Phaser.Keyboard.ESC)
        }
        tutorialKeys = {
            spacebar: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        }

        // add clam to center on load
        clam = game.add.sprite(512, 512-10, "Clam");
        clam.animations.add('Resting', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
        

        ClamBubbles = game.add.audio("ClamBubbles");
        LaserSound = game.add.audio("laser")

        clam.scale.setTo(1.1, 1.1)
        clam.anchor.setTo(0.5, 0.5)
        game.physics.enable(clam)

        Clam(ClamBubbles);

        //unpauses game

        //added a start level button
        startButton = game.add.button(32*15, 32*17, 'start', startLevel, this, 1, 0, 2);
        // startButton.fixedToCamera = true;
        // startButton.anchor.setTo(0.5, 0.5);
        // startButton.scale.setTo(0.2,0.2);

        // call clickHandler function when tile is clicked
        game.input.onDown.add(clickHandler, this);

        game.input.onDown.add(sellCoral, this);

        //shop
        shopbar = game.add.graphics();
        shopbar.beginFill(0xffffff);
        shopbar.drawRect(550, 0, 250, 75);
        shopbar.alpha = 0.75
        shopbar.endFill();
        // shopbar = game.add.sprite(800, 0, 'shop_bar');
        shopbar.inputEnabled = true;
        shopbar.fixedToCamera = true;
        shopbar.anchor.setTo(1, 0)
        shopbar.scale.setTo(1,1)



        gold = game.add.sprite(790, 5, "gold");
        gold.fixedToCamera = true;
        gold.anchor.setTo(1,0)
        gold.scale.setTo(.035,.035)

        //money
        moneyTXT = game.add.text(795, 40, balance, {font: "18px Arial", fill: "#000000", align: "right" });
        moneyTXT.fixedToCamera = true;
        moneyTXT.anchor.setTo(1,0)

        //coral1 shop
        tower1_button = game.add.sprite(560, 2, 'tower1');
        tower1_button.inputEnabled = true;
        tower1_button.fixedToCamera = true;
        tower1_button.anchor.setTo(0, 0);
        tower1_button.scale.setTo(0.8,0.8);
        tower1_button.animations.add('idle1', [0,1,2,3]);

        tower1_cost = game.add.text(560, 40, "Press 1\n"+prices[0]+"G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "center"})
        tower1_cost.fixedToCamera = true;
        // tower1_cost.anchor.setTo(1,0)

        //coral2 shop
        tower2_button = game.add.sprite(610, 2, 'tower2');
        tower2_button.inputEnabled = true;
        tower2_button.fixedToCamera = true;
        tower2_button.anchor.setTo(0, 0);
        tower2_button.scale.setTo(.9, .9)
        tower2_button.animations.add('idle2', [0,1,2,3]);

        tower2_cost = game.add.text(610, 40, "Press 2\n"+prices[1]+"G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "center"})
        tower2_cost.fixedToCamera = true;
        // tower2_cost.anchor.setTo(1,0)

        //coral3 shop
        tower3_button = game.add.sprite(660, 2, 'tower3');
        tower3_button.inputEnabled = true;
        tower3_button.fixedToCamera = true;
        tower3_button.anchor.setTo(0, 0);
        tower3_button.scale.setTo(0.8,0.8);
        tower3_button.animations.add('idle3', [0,1,2,3]);

        tower3_cost = game.add.text(660, 40, "Press 3\n"+prices[2]+"G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "center"})
        tower3_cost.fixedToCamera = true;
        // tower3_cost.anchor.setTo(1,0)

        //coral4 shop
        tower4_button = game.add.sprite(710, 2, 'tower4');
        tower4_button.inputEnabled = true;
        tower4_button.fixedToCamera = true;
        tower4_button.anchor.setTo(0, 0);
        tower4_button.scale.setTo(1,1);
        tower4_button.animations.add('idle4', [0,1,2,3]);

        tower4_cost = game.add.text(710, 40, "Press 4\n"+prices[3]+"G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "center"})
        tower4_cost.fixedToCamera = true;
        // tower4_cost.anchor.setTo(1,0)

        //Statbar
        statbar = game.add.graphics();
        statbar.beginFill(0xffffff);
        statbar.drawRect(640, 75, 250, 75);
        statbar.alpha = 0.75
        statbar.endFill();
        statbar.fixedToCamera = true;
        statbar.alpha = 0

        statTXT = game.add.text(650, 75, "Stats", {font: "20px Arial", text: "bold()", fill: "#000000", align: "center"})
        statTXT.fixedToCamera = true;
        statTXT.bringToTop()
        statTXT.alpha = 0

        //Stats for tower1
        icon1 = game.add.sprite(655, 100, 'tower1')
        icon1.fixedToCamera = true;
        icon1.bringToTop()
        icon1.alpha = 0

        statTXT1 = game.add.text(715, 80, "Health: 3\nRange: 72\nFirerate: A", {font: "16px Arial", text: "bold()", fill: "#000000", align: "left"})
        statTXT1.fixedToCamera = true;
        statTXT1.bringToTop()
        statTXT1.alpha = 0

        /*
        CoralDescription1 = game.add.text(615, 200, "A coral made of pure \ngold. Produces more \ngold after the end of\neach round.", {font: "10px Arial", text: "bold()", fill: "#000000", align: "left"})
        CoralDescription1.fixedToCamera = true;
        CoralDescription1.alpha = 0
        */
        
        //Stats for tower2
        icon2 = game.add.sprite(655, 100, 'tower2')
        icon2.fixedToCamera = true;
        icon2.bringToTop()
        icon2.alpha = 0
        statTXT2 = game.add.text(715, 80, "Health: 2\nRange: 128\nFirerate: B", {font: "16px Arial", text: "bold()", fill: "#000000", align: "left"})
        statTXT2.fixedToCamera = true;
        statTXT2.bringToTop()
        statTXT2.alpha = 0

        //Stats for tower3
        icon3 = game.add.sprite(655, 100, 'tower3')
        icon3.fixedToCamera = true;
        icon3.bringToTop()
        icon3.alpha = 0
        statTXT3 = game.add.text(715, 80, "Health: 1\nRange: 256\nFirerate: C", {font: "16px Arial", text: "bold()", fill: "#000000", align: "left"})
        statTXT3.fixedToCamera = true;
        statTXT3.bringToTop()
        statTXT3.alpha = 0

        //Stats for tower4
        icon4 = game.add.sprite(655, 100, 'tower4')
        icon4.fixedToCamera = true;
        icon4.bringToTop()
        icon4.alpha = 0
        statTXT4 = game.add.text(715, 80, "Health: 1\nRange: 0\nFirerate: F", {font: "16px Arial", text: "bold()", fill: "#000000", align: "left"})
        statTXT4.fixedToCamera = true;
        statTXT4.bringToTop()
        statTXT4.alpha = 0
        CoralDescription4 = game.add.text(555, 80, "A coral made of pure \ngold. Produces more \ngold after the end of\neach round.", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        CoralDescription4.fixedToCamera = true;
        CoralDescription4.bringToTop()
        CoralDescription4.alpha = 0
        

        textbox = game.add.sprite(game.width/2 - 200, 10, "TXTbox");
        textbox.destroy()
        skipTXT = game.add.text(game.width/2  , 70, "",{font: "10px Arial", text: "bold()", fill: "#ffffff", align: "right"} )
        // create bullets group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(200, 'Bullet');
        bullets.setAll('checkWorldBounds', true);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('anchor.y', 0.25);


        pauseKeybindTXT = game.add.text(20,50, 'Press "P" for help', {font: "20px Arial", text: "bold()", fill: "#ffffff", align: "right"})
        pauseKeybindTXT.fixedToCamera = true


        /*
        menu = game.add.sprite(210,400, 'pausemenu')
        menu.scale.setTo(3,2)
        menu.bringToTop()

        unpauseTXT = game.add.text(32*15, 32*17, "Resume", {font: "20px Arial", text: "bold()", fill: "#000000", align: "right"} );
        unpauseTXT.bringToTop()
        game.input.onDown.add(unpausing, self);
        */


        // create lasers group
        lasers = game.add.group();
        lasers.enableBody = true;
        lasers.physicsBodyType = Phaser.Physics.ARCADE;
        lasers.createMultiple(100, 'Laser');
        lasers.setAll('checkWorldBounds', true);
        lasers.setAll('outOfBoundsKill', true);
        lasers.setAll('anchor.y', 0.25);
        enemies = game.add.group()

        WaveCounter = game.add.text(20, 20, "Wave: "+WaveCount+ "/"+finalWaveCount, {font: "30px Arial", text: "bold()", fill: "#ffffff", align: "center"});
        WaveCounter.fixedToCamera = true;

        nextPlacement = game.time.now
    },

    update: function() {
        
        // layerRise();

        // set tower type based on number keys
        if (towerKeys.one.isDown){
            towertype = 1
            dummytower = new Coral(
                id = 99,
                type = towertype,
            );
            buildMode = true
            updateMarker()
            tower1_button.animations.play('idle1', 5, true)
        }
        else{
            tower1_button.animations.stop()
        }
        if (towerKeys.two.isDown){
            towertype = 2
            dummytower = new Coral(
                id = 99,
                type = towertype,
            );
            buildMode = true
            updateMarker()
            tower2_button.animations.play('idle2', 5, true);
        }
        else{
            tower2_button.animations.stop()
        }
        if (towerKeys.three.isDown){
            towertype = 3
            dummytower = new Coral(
                id = 99,
                type = towertype,
            );
            buildMode = true
            updateMarker()
            tower3_button.animations.play('idle3', 5, true);
        }
        else{
            tower3_button.animations.stop()
        }

        if (towerKeys.four.isDown){
            towertype = 4
            dummytower = new Coral(
                id = 99,
                type = towertype,
            );
            buildMode = true
            updateMarker()
            //tower3_button.animations.play('idle3', 5, true);
        }
        else{
            //tower3_button.animations.stop()
        }

        /* hovering over shopbar changes transparency
        if(shopbar.input.pointerOver()){
            shopbar.alpha = .5;
            tower1_button.alpha = .5;
            tower1_cost.alpha = .5;
            tower2_button.alpha = .5;
            tower2_cost.alpha = .5;
            tower3_button.alpha = .5;
            tower3_cost.alpha = .5;
            tower4_button.alpha = .5;
            tower4_cost.alpha = .5;
        }
        else{
            shopbar.alpha = 1;
            tower1_button.alpha = 1;
            tower1_cost.alpha = 1;
            tower2_button.alpha = 1;
            tower2_cost.alpha = 1;
            tower3_button.alpha = 1;
            tower3_cost.alpha = 1;
            tower4_button.alpha = 1;
            tower4_cost.alpha = 1;
        }
        */

        //Tower hover
        if(tower1_button.input.pointerOver()){
            statbar.clear()
            statbar.beginFill(0xffffff);
            statbar.drawRect(640, 75, 250, 75);
            statbar.alpha = 0.75
            statbar.endFill();
            statTXT.alpha = 1;
            icon1.alpha = 1;
            statTXT1.alpha = 1;
            icon2.alpha = 0;
            statTXT2.alpha = 0;
            icon3.alpha = 0;
            statTXT3.alpha = 0;
            icon4.alpha = 0;
            statTXT4.alpha = 0;
            CoralDescription4.alpha = 0;
            //CoralDescription1.alpha = 1
        }
        else if(tower2_button.input.pointerOver()){
            statbar.clear()
            statbar.beginFill(0xffffff);
            statbar.drawRect(640, 75, 250, 75);
            statbar.alpha = 0.75
            statbar.endFill();
            statTXT.alpha = 1;
            icon1.alpha = 0;
            statTXT1.alpha = 0;
            icon2.alpha = 1;
            statTXT2.alpha = 1;
            icon3.alpha = 0;
            statTXT3.alpha = 0;
            icon4.alpha = 0;
            statTXT4.alpha = 0;
            CoralDescription4.alpha = 0;
            //CoralDescription1.alpha = 0;
        }
        else if(tower3_button.input.pointerOver()){
            statbar.clear()
            statbar.beginFill(0xffffff);
            statbar.drawRect(640, 75, 250, 75);
            statbar.alpha = 0.75
            statbar.endFill();
            statTXT.alpha = 1;
            icon3.alpha = 1;
            statTXT3.alpha = 1;
            icon2.alpha = 0;
            statTXT2.alpha = 0;
            icon1.alpha = 0;
            statTXT1.alpha = 0;
            icon4.alpha = 0;
            statTXT4.alpha = 0;
            CoralDescription4.alpha = 0;

        }
        else if(tower4_button.input.pointerOver()){
            statbar.clear()
            statbar.beginFill(0xffffff);
            statbar.drawRect(550, 75, 250, 75);
            statbar.alpha = 0.75
            statbar.endFill();
            statTXT.alpha = 1;
            icon4.alpha = 1;
            statTXT4.alpha = 1;
            statTXT4.bringToTop();
            CoralDescription4.alpha = 1;
            icon3.alpha = 0;
            statTXT3.alpha = 0;
            icon2.alpha = 0;
            statTXT2.alpha = 0;
            icon1.alpha = 0;
            statTXT1.alpha = 0;
        }
        else{
            statbar.clear();
            statTXT.alpha = 0;
            icon4.alpha = 0;
            statTXT4.alpha = 0;
            CoralDescription4.alpha = 0;
            icon3.alpha = 0;
            statTXT3.alpha = 0;
            icon2.alpha = 0;
            statTXT2.alpha = 0;
            icon1.alpha = 0;
            statTXT1.alpha = 0;
            layerRise()
        }
        //add tower 4 functionality


        //sell actions

        if (sell.sell.isDown && gameBoard[lastClickedTile.x][lastClickedTile.y] !== "None") {
            toBeSoldCoral = gameBoard[lastClickedTile.x][lastClickedTile.y]
            toBeSoldCoral.sprite.damage(10);
            moneyBack = (toBeSoldCoral.cost)/2;
            balance += moneyBack;
            gameBoard[lastClickedTile.x][lastClickedTile.y] = "None"
            sellMarker.clear()
            sellMarker = "None"

            layerRise();
            
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

        //pause
        if (pauseKeys.p.isDown){
            pausing()
        }
        /*
        if (pauseKeys.shift.isDown){
            if (game.paused = true){
                unpausing()
            }
        }
        */

        if (exitBuildMode.esc.isDown) {
            buildMode = false
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
        if(WaveCount > finalWaveCount){
            game.state.start('win')
        }
        
        // initial hard coding for enemy wave
        if(defending & gameOver == 0) {
            if (EnemyWaves[wave].killCount >= EnemyWaves[wave].enemyCount) {
                defending = 0
                wave++
                nextWave = game.time.now + 4000 // set delay until next wave
            } else {
                WavePlacements(wave)
                game.physics.arcade.overlap(bullets, enemies, enemyHit)
                game.physics.arcade.overlap(enemies, clam, clamHit)
                // kill bullets outside of coral radius
                for (i=0, len=bullets.children.length; i < len; i++) {
                    if (Phaser.Math.distance(bullets.children[i].x, bullets.children[i].y, bullets.children[i].sourcex, bullets.children[i].sourcey) > bullets.children[i].sourcerange) {
                        bullets.children[i].kill()
                    }
                }
                if (EnemyWaves[wave].sprite == 'Shark') {
                    fireLaser()
                    for (i = 0; i <= 31; i += 1) {
                        for (j = 0; j <= 31; j += 1) {
                            if (typeof gameBoard[i][j] === 'object') {
                                if (gameBoard[i][j].id.slice(0, 1) === "c") {
                                    if (defending) {
                                        hitCoral = gameBoard[i][j].sprite
                                        game.physics.arcade.overlap(lasers, hitCoral, coralHit)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (nextWave < game.time.now & nextWave !== 0) {
            nextWave = 0
            defending = 1
            WaveStart(wave)
        } else {
            for (i=0, len=bullets.children.length; i<len; i++) {
                bullets.children[i].kill()
            }
            for (i=0, len=enemies.children.length; i<len; i++) {
                enemies.children[i].body.reset(enemies.children[i].x, enemies.children[i].y)
            }
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

async function coralHit (hitCoral, laser) {
    laser.destroy()
    hitCoral.damage(1)
    if ( hitCoral.health <= 0 ) {
        gameBoard[hitCoral.position.x/32][hitCoral.position.y/32] = "None"
    }
    hitCoral.alpha = .1 + .9 * ( hitCoral.health / (3/hitCoral.type) )
}

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

        if (enemy.key == 'Crab_Boss' || enemy.key == 'Jellyfish_Boss' || enemy.key == 'Eel_Boss') {
            console.log(enemy.key)
            balance += 30
        }

        else {

            balance+=5
        }
        
        
        layerRise()
    }
    enemy.damage(1)

    enemy.alpha = .1 + .9 * (enemy.health / EnemyWaves[wave].health)
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
        WaveCount = 0
    }
    else{
        BG_music.resume();
    }
}

function fireLaser () {
    closestCoral = 9999
    fireAt = {}
    if (game.time.now > nextLaser & enemies.length > 0) {
        laserFire = 0
        for (i = 0; i <= 31; i += 1) {
            for (j = 0; j <= 31; j += 1) {
                loopCoral = gameBoard[i][j]
                if (typeof loopCoral === 'object') {
                    if (loopCoral.id.slice(0, 1) === "c") {
                        laserFire += 1
                        if (loopCoral.closestEnemy !== null) {
                            if (loopCoral.enemyDistance <= closestCoral) {
                                closestCoral = loopCoral.enemyDistance
                                fireAt['i'] = i
                                fireAt['j'] = j
                            }
                        } else {
                            fireAt['i'] = i
                            fireAt['j'] = j
                        }
                    }
                }
            }
        }
        if (laserFire > 0) {
            fireAtCoral = gameBoard[fireAt['i']][fireAt['j']]
            nextLaser = game.time.now + laserDelay;
            laser = lasers.getFirstDead();
            laser.reset(enemies.children[0].world.x+84, enemies.children[0].world.y-32);
            game.physics.arcade.moveToObject(laser, fireAtCoral.sprite, 500);
            laser.sourcex = enemies.children[0].world.x+84;
            laser.sourcey = enemies.children[0].world.y-32;
            laser.rotation = game.physics.arcade.angleToXY(laser, gameBoard[fireAt['i']][fireAt['j']].worldX, gameBoard[fireAt['i']][fireAt['j']].worldY)
            LaserSound.play()
        }
    }


}

//Win event
function win(){
        game.state.start("win");
        WaveCount = 0
}
// coral class for coral objects
class Coral {
    constructor (id, type) {
        this.id = id
        this.type = type
        switch (this.type) {
            case 1:
                this.range = 72; //was 64
                this.fireRate = 400 // was 400
                this.spriteName = 'tower1'
                this.cost = prices[0]
                this.health = 3 / this.type
                //added same sound for all towers for now on shoot, can swap easily later
                this.popSound = game.add.audio("PopSound")
                break;
            case 2:
                this.range = 144;
                this.fireRate = 500 //was 800
                this.spriteName = 'tower2'
                this.cost = prices[1]
                this.health = 3 / this.type
                this.popSound = game.add.audio("PopSound")
                break;
            case 3:
                this.range = 276;
                this.fireRate = 600 //was 1200
                this.spriteName = 'tower3'
                this.cost = prices[2]
                this.health = 3 / this.type
                this.popSound = game.add.audio("PopSound")
                break;
            case 4:
                this.range = 0;
                this.fireRate = 0;
                this.spriteName = 'tower4'
                this.cost = prices[3]
                this.health = 3 / this.type
                this.popSound = game.add.audio("PopSound")
                break;
        }
        this.nextFire = 0
        this.closestEnemy = null
        this.moneyBag = game.add.audio("MoneyBag")
    }
    // locating coral method
    locate (tile, gameBoard) {
        // add currency check here later

        // tile == null means there is no water on the mid layer
        if (tile == null || buildMode == false){
            return 0;
        // if there is nothing on gameBoard, place coral object
        } else if (gameBoard[tile.x][tile.y] === "None" && balance >= this.cost) {
            balance -= this.cost

            if (this.type == 4){
                moneyCoral += 1
            } 

            this.sprite = game.add.sprite(tile.worldX, tile.worldY - 10, this.spriteName)
            this.sprite.type = this.type
            this.sprite.health = this.health

            if (this.type == 4) {
                game.physics.enable(this.sprite);
                this.sprite.animations.add("resting"+this.id, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
                this.moneyBag.play();
            }

            else {
                game.physics.enable(this.sprite);
                this.sprite.animations.add("resting"+this.id, [0,1,2,3])
                this.sprite.animations.add("attacking"+this.id, [3,4,5,6])
                this.sprite.animations.play("resting"+this.id, 3, true)
                this.moneyBag.play();
            }
            
            
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
            bullet.sourcex = this.sprite.centerX;
            bullet.sourcey = this.sprite.centerY;
            bullet.sourcerange = this.range;
            bullet.rotation = game.physics.arcade.angleToXY(bullet, enemy.centerX, enemy.centerY)
            this.popSound.play("", 0, .2);
        }
    }
}

// creates enemies group depending on wave details
function WaveStart(wave) {
    // Create Enemies Group For each wave

    //adds balance for moneyCorals
    if (WaveCount > 0) {
        balance += 20 * moneyCoral
    }
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
        enemy.angle = 0
        enemy.scale.x = Math.abs(enemy.scale.x);
        enemy.alpha = 1
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
            case 'Shark':
                enemy.body.setSize(EnemyWaves[wave].width, EnemyWaves[wave].height)
                enemy.animations.add('swim', [2,3,4,0,1,5,6,7])
                enemy.animations.play('swim', 8, true);
                break;
            //minibosses
            case 'Crab_Boss':
                enemy.body.setSize(EnemyWaves[wave].width/3, EnemyWaves[wave].height/3)
                enemy.scale.setTo(2,2);
                enemy.animations.add('walk', [0,1,2,3,4,5]);
                enemy.animations.play('walk', 18, true);
                break;
            case 'Jellyfish_Boss':
                enemy.body.setSize(EnemyWaves[wave].width/3, EnemyWaves[wave].height/3)
                enemy.scale.setTo(2, 2);
                enemy.animations.add('swim', [0,1,2,3,4,5,6,7,8,9,10,11])
                enemy.animations.play('swim', 8, true);
                break;
            case 'Eel_Boss':
                enemy.body.setSize(80, EnemyWaves[wave].height/3)
                enemy.scale.setTo(2, 2);
                enemy.animations.add('swim', [0,1,2,3,4,5,6,7,8,9,10,11]);
                enemy.animations.play('swim', 18, true);
                break;
        }
        enemy.anchor.setTo(0.5, 0.5);

        directions = EnemyWaves[wave].spawnLocation
        if (nextDirection > directions.length-1) {
            nextDirection = 0
        }
        direction = directions[nextDirection]
        nextDirection = ((nextDirection+1) % (directions.length))

        switch (direction) {
            case 'left':
                var spawnX = 32
                var spawnY = 512
                break
            case 'top':
                if (['Eel', 'Shark', 'Eel_Boss'].includes(EnemyWaves[wave].sprite)){
                    enemy.angle = 90
                }
                var spawnX = 512
                var spawnY = 32
                break
            case 'right':
                if (['Eel', 'Shark', 'Eel_Boss'].includes(EnemyWaves[wave].sprite)){
                    enemy.scale.x *= -1;
                }
                var spawnX = 992
                var spawnY = 512
                break
            case 'bottom':
                if (['Eel', 'Shark', 'Eel_Boss'].includes(EnemyWaves[wave].sprite)){
                    enemy.angle = -90
                }
                var spawnX = 512
                var spawnY = 992
                break
        }
        enemy.reset(spawnX + (Math.random()*48) - 24, spawnY + (Math.random()*24) - 12)  // set starting location with some variation.
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
    
    coral1 = new Coral(
        id = coralid,
        type = towertype,
    );

    // locate coral with curent id to game board (increment coralid with prefix if success)
    if ( tempCoral.locate(watertile, gameBoard) ) {coralid = coralid.slice(0,1) + (Number(coralid.slice(1)) + 1)};
    
    //game.debug.text(watertile.worldY, watertile.worldX)
    //game.debug.text(gameBoard[watertile.worldX][watertile.worldY].id)

    // game.debug.text(coralid, 12, 36)
    // game.debug.text("Tile: world: {"+tile.worldX+","+tile.worldY+"} index: ("+tile.x+","+tile.y+")", 12, 16);

    layerRise()

}

function sellCoral() {

    pointerX = SandBottom.getTileX(game.input.activePointer.worldX);
    pointerY = SandBottom.getTileY(game.input.activePointer.worldY);
    tile = map.getTile(pointerX, pointerY, SandBottom);

    waterpointerX = WaterEdgesMid.getTileX(game.input.activePointer.worldX);
    waterpointerY = WaterEdgesMid.getTileY(game.input.activePointer.worldY);
    watertile = map.getTile(pointerX, pointerY, WaterEdgesMid);

    if (watertile !== null) {
        if (typeof(gameBoard[watertile.x][watertile.y]) === 'object') {
            if (sellMarker !== "None") {
                sellMarker.clear()
            }

            sellMarker = game.add.graphics();
            // selMarker.beginFill(0xff0000);
            sellMarker.lineStyle(2, "0xFFFFFF", 1)
            sellMarker.drawRect(watertile.worldX, watertile.worldY - 10, 32, 40);

            lastClickedTile = watertile


            // selMarker.endFill(0xff0000);
        }
    }
}

function layerRise() {
    moneyTXT.text = balance;
    // keep controls on top after building corals
    startButton.bringToTop();
    game.world.bringToTop(shopbar);
    gold.bringToTop();
    moneyTXT.bringToTop();
    tower1_button.bringToTop();
    tower1_cost.bringToTop();
    tower2_button.bringToTop();
    tower2_cost.bringToTop();
    tower3_button.bringToTop();
    tower3_cost.bringToTop();
    tower4_button.bringToTop();
    tower4_cost.bringToTop();
    WaveCounter.bringToTop();
}

// display rectangle on mouse location
function updateMarker() {
    markerx = WaterEdgesMid.getTileX(game.input.activePointer.worldX) * 32;
    markery = WaterEdgesMid.getTileY(game.input.activePointer.worldY) * 32;
    // if ((markerx == 32*15 & markery == 32*17) | (markerx == 32*16 & markery == 32*17)) {
    if (WaterEdgesMid.getTiles(game.input.activePointer.worldX, game.input.activePointer.worldY,32,32)[0].index == -1 || buildMode == false) {
        marker2.clear()
        marker.visible = false
    } else {
        marker.visible = true
        marker.x = markerx
        marker.y = markery - 10
        marker.frame = towertype - 1

        marker2.clear()
        marker2.beginFill("0xFFFFFF", 0.2);
        marker2.drawCircle(markerx+16, markery+16, dummytower.range*2);
        marker2.endFill();

        //radius = towerRange
        //add a spritesheet that has all three imgs one from each tower
        //when doing new image (loading new img)
        //marker.frame = towertype
        //when loading marker, specify which frame 
        //when loading marker, specify which frame
        //radius add another marker, do a fill instead of line and make radius equal to tower range property from tower selected.
        //this is in the coral class, create a new coral(clickhandler for this format), dont place the coral (dont use locate), use that coral.range  
        //coral1 = newcoral, id2type = 2
        //radius = coral.range
    }
}

// sleep function
function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds*1000));
}

function pausing(){
    game.paused = true
    
    game.camera.x = ((32**2-game.width)/2);
    game.camera.y = ((32**2-game.height)/2);
    menu = game.add.sprite(210,300, 'TXTbox')
    menu.scale.setTo(7.4,4)
    menu.bringToTop()
    tutorialTextList = [
        " ",
        "Move the camera with 'W' 'A' 'S' 'D'",
        "Reef defense is a wave based tower defense where each wave\nhas a set number of enemies to destroy before the next wave \nstarts",
        "Every wave, enemies such as crabs, eels, etc. will spawn from any \nof the four caves and all enemies are after your clam",
        "To protect the clam, you need to place down corals, which will act\n as your towers. These corals will automatically shoot pellets\n towards incoming enemies, dealing damage",
        "Different corals have different stats such as health, shooting speed,\nand range. Shooting speed indicates how fast a tower shoots each\npellet. Range indicates how far the coral can target enemies",
        "To select the coral you want to place, press the corresponding\nnumber of the coral, this is defaulted to the red coral if\n no number is pressed",
        "Hovering the selected coral over a tile will show the coral's range",
        "You can toggle between build and select mode with the 'esc' key. At \nthe start of the game, it will default to the build mode.",
        "While in build mode, the players can buy and place corals.",
        "Select mode allows for players to click freely without having to \nworry about accidently placing down corals.",
        "While in build mode, Left mouse click will place the selected \ncoral onto any water tiles. Keep in mind, that you need to have \nenough gold to place the coral. Sand tiles, as well as caves tiles, \ncannot be built on top of.",
        "On the top right is the shop as well as your current gold.\nRight next to each coral is the amount of gold it costs",
        "Hovering over each icon will show you the coral's stats",
        "The player will start with 100 gold coins.",
        "To earn gold, killing an enemy will net the player 5 gold \nper enemy destroyed. The gold coral will also give you 20 gold at\nthe end of every round per gold coral.",
        "To sell a coral, click on the coral you want to get rid of.\n A white box should appear, indicating that it is selected\nThen press the 'delete' key to sell the tower for half the \ncost of the tower",            
        "When you're ready to start the wave, click on the 'start' button",
        "Every wave will be more difficult than the last so plan well, \nand good luck!",
        "Press anywhere on the screen to continue",
        " ",
    ]; 

    ControlBox = game.add.image(90, 420, 'TXTbox')
    ControlBox.scale.setTo(7.4,4);
    ControlBox.fixedToCamera = true;
    ControlBox.bringToTop()

    ControlsTXT = game.add.text(350, 430, "Keybindings",{font: "20px Arial", text: "bold()", fill: "#ffffff", align: "left"} );
    ControlsTXT.fixedToCamera = true;
    ControlsTXT.bringToTop();

    CameraTXT = game.add.text(110, 465, "Camera Controls",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} );
    CameraTXT.fixedToCamera = true;
    CameraTXT.bringToTop();

    Camera = game.add.image(110, 510,'CameraKeys')
    Camera.scale.setTo(1.2, 1.2)
    Camera.fixedToCamera = true;
    Camera.bringToTop()

    LmbTXT = game.add.text(255, 465, "Place/Buy Coral",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} );
    LmbTXT.fixedToCamera = true;
    LmbTXT.bringToTop();

    LeftMouseButton = game.add.image(275, 510,'LMB')
    LeftMouseButton.scale.setTo(1.1, 1.0)
    LeftMouseButton.fixedToCamera = true;
    LeftMouseButton.bringToTop()
    

    DeleteTXT = game.add.text(400, 465, "Sell Coral",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} )
    DeleteTXT.fixedToCamera = true;
    DeleteTXT.bringToTop();

    DeleteTXT2 = game.add.text(400, 480, "(need to click on",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} )
    DeleteTXT2.fixedToCamera = true;
    DeleteTXT2.bringToTop();

    DeleteTXT3 = game.add.text(400, 495, "coral first)",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} )
    DeleteTXT3.fixedToCamera = true;
    DeleteTXT3.bringToTop();

    DeleteKey= game.add.image(420, 520,'DeleteKey')
    DeleteKey.scale.setTo(1.1, 1.0)
    DeleteKey.fixedToCamera = true;
    DeleteKey.bringToTop()

    EscapeMode = game.add.text(540, 465, "Press 'esc' to toggle ",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"})
    EscapeMode.fixedToCamera = true;
    EscapeMode.bringToTop()

    EscapeMode2 = game.add.text(540, 480, "build/select mode",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"})
    EscapeMode2.fixedToCamera = true;
    EscapeMode2.bringToTop()

    EscapeKeyImg = game.add.image(570, 520, "escapeKey")
    EscapeKeyImg.scale.setTo(1.5,1.5);
    EscapeKeyImg.fixedToCamera = true;
    EscapeKeyImg.bringToTop()
    

    tutorial_TXT = game.add.text(110, 100, "Welcome to Reef Defense!",{font: "20px Arial", text: "bold()", fill: "#ffffff", align: "left"})
    tutorial_TXT.fixedToCamera = true;
    tutorial_TXT.visible = true

    counter = 1

    tutorialKeys.spacebar.onDown.add(changeTXT);

    nextTXT = game.add.text(270, 230, "Press Spacebar to continue tutorial",{font: "20px Arial", text: "bold()", fill: "#ffffff", align: "left"})
    nextTXT.fixedToCamera = true;
    nextTXT.bringToTop()

    unpauseTXT = game.add.text(230, 250, "Resume game by clicking the resume button", {font: "20px Arial", text: "bold()", fill: "#000000", align: "right"} );
    unpauseTXT.fixedToCamera = true;
    unpauseTXT.bringToTop()

    resumeButton = game.add.button(450, 500, 'resume', unpausing, this, 1, 0, 2);
    resumeButton.scale.setTo(.8, .5)

    quitButton = game.add.button(472, 590, 'quitButton', quiting, this, 1, 0, 2);
    quitButton.scale.setTo(.5, .5)
    
    //game.input.onDown.add(unpausing, self);


    
}

function unpausing(){
    if (game.paused == true){
        game.paused = false

        menu.destroy()
        unpauseTXT.destroy()
        tutorial_TXT.text = tutorialTextList[0];
        nextTXT.destroy()

        ControlBox.destroy()
        ControlsTXT.destroy()

        CameraTXT.destroy()
        Camera.destroy()

        LmbTXT.destroy()
        LeftMouseButton.destroy()

        DeleteTXT.destroy()
        DeleteKey.destroy()
        DeleteTXT2.destroy()
        DeleteTXT3.destroy()

        EscapeMode.destroy()
        EscapeMode2.destroy()
        EscapeKeyImg.destroy()

        resumeButton.destroy()
        quitButton.destroy()
        
    }
}
function quiting(){
    game.paused = false
    game.state.start("menu")
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
function changeTXT(){
    tutorial_TXT.text = tutorialTextList[counter];
    counter +=1
}
/* possible debuging for hover event
function p(hover){
    console.log(hover.event);
}
*/