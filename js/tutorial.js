var counter = 0;

var tutorialState = {
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
        game.load.image('TXTbox', 'Assets/spritesheets/Textbox blue.png')
    },

    create: function(){
        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});
        // tile map and layers
        //counter = 1
        //slide = game.add.image("water")
        //slide.LoadTexture(imageList[counter])
        //still need to preload them all
        //imageList =  [" ", " ", " ",]
        //counter+=1
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

        ///testMessageBox()

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
            
        };
        tutorialKeys = {
            spacebar: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            esc: game.input.keyboard.addKey(Phaser.Keyboard.ESC)
        };
        ///spacebar.events.onDown.add(this.testMessageBox,this)

        
        
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

        gold = game.add.sprite(750, 0, "gold");
        gold.fixedToCamera = true;
        gold.anchor.setTo(1,0)
        gold.scale.setTo(.03,.03)

        //money 
        moneyTXT = game.add.text(790, 5, balance, {font: "18px Arial", fill: "#000000", align: "left" });
        moneyTXT.fixedToCamera = true;
        moneyTXT.anchor.setTo(1,0)

        tower1_button = game.add.sprite(725, 30, 'tower1');
        tower1_button.fixedToCamera = true;
        //tower1_button.anchor.setTo(1, 0);

        tower1_cost = game.add.text(795, 40, "Press 1\n10G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower1_cost.fixedToCamera = true;
        tower1_cost.anchor.setTo(1,0)

        tower2_button = game.add.sprite(725, 80, 'tower2');
        tower2_button.fixedToCamera = true;
        //tower2_button.anchor.setTo(1, 0);

        tower2_cost = game.add.text(795, 80, "Press 2\n20G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower2_cost.fixedToCamera = true;
        tower2_cost.anchor.setTo(1,0)

        tower3_button = game.add.sprite(725, 120, 'tower3');
        tower3_button.fixedToCamera = true;
        //tower2_button.anchor.setTo(1, 0);

        tower3_cost = game.add.text(795, 120, "Press 3\n20G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower3_cost.fixedToCamera = true;
        tower3_cost.anchor.setTo(1,0)

        textbox = game.add.sprite(game.width/2 - 200, 10, "TXTbox");
        textbox.fixedToCamera = true;
        textbox.scale.setTo(6, 1.5);

        skipTXT = game.add.text(game.width/2  , 70, "press spacebar to proceed, press esc to exit to main menu",{font: "10px Arial", text: "bold()", fill: "#ffffff", align: "right"} )
        skipTXT.fixedToCamera = true;
        /*
        msgBox.x = game.width / 2 - msgBox.width / 2;
        msgBox.y = game.height / 2 - msgBox.height / 2;
        */
       ///could do the same logic with gameload
       ///example
        /*
        TutorialExample = [
            {
                text:"Welcome to Reef Defense!";
                height: 35
            }
            {
                text: 
            }
        ]
        */
        /// instead of text[list], use tutorial_TXT[counter].text
        /// 

        tutorial_TXT = game.add.text(game.width / 2 - 180, 10, "Welcome to Reef Defense!",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorial_TXT.fixedToCamera = true;
        tutorial_TXT.visible = true

        /// Tutorial Text
        tutorialTXT0 = game.add.text(game.width / 2 - 180, 10, "Welcome to Reef Defense!",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT0.fixedToCamera = true;
        tutorialTXT0.visible = false

        tutorialTXT1 = game.add.text(game.width / 2 - 180, 10, "Reef Defense is a tower defense game where the main objective is\n to build towers to protect the clam from the oncoming waves\n of enemies trying to steal the pearl",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"});
        tutorialTXT1.fixedToCamera = true;
        tutorialTXT1.visible =false

        tutorialTXT2 = game.add.text(game.width / 2 - 180, 10, "Move the camera with w, a, s, d",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"});
        tutorialTXT2.fixedToCamera = true;
        tutorialTXT2.visible = false

        tutorialTXT3 = game.add.text(game.width / 2 - 180, 10, "On the top right shows you the shop as well as your current gold",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT3.fixedToCamera = true;
        tutorialTXT3.visible = false

        tutorialTXT4 = game.add.text(game.width / 2 - 180, 10, "Right next to each turrent is the amount of gold it costs",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT4.fixedToCamera = true;
        tutorialTXT4.visible = false

        tutorialTXT5 = game.add.text(game.width / 2 - 180, 10, "To place turrents, press the corresponding number of the tower \nyou want to place",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT5.fixedToCamera = true;
        tutorialTXT5.visible = false

        tutorialTXT6 = game.add.text(game.width / 2 - 180, 10, "Then use left mouse click to place it on the tile you want",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT6.fixedToCamera = true;
        tutorialTXT6.visible = false

        tutorialTXT7 = game.add.text(game.width / 2 - 180, 10, "When you're ready to start the wave, click on the 'start' button",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT7.fixedToCamera = true;
        tutorialTXT7.visible = false

        tutorialTXT8 = game.add.text(game.width / 2 - 180, 10, "Every wave will be more difficult than the last so plan well, \nand good luck!",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorialTXT8.fixedToCamera = true;
        tutorialTXT8.visible = false
        tutorialTextList = [
            "Reef Defense is a tower defense game where the main objective is\n to build towers to protect the clam from the oncoming waves\n of enemies trying to steal the pearl",
            "Move the camera with w, a, s, d",

        ] 
        counter = 0

        ///add changetxt function, start it at 0
        ///tutorialTXT.text = 


        /*
        if (tutorialKeys.spacebar.isDown){
            game.input.onDown.addOnce(removeTXT, this)
            counter +=1
            tutorialTXT1 = game.add.text(game.width / 2 - 180, 10, "Reef Defense is a tower defense game where the main objective is\n to build towers to protect the clam from the oncoming waves\n of enemies trying to steal the pearl",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
            tutorialTXT1.fixedToCamera = true;
        };
        */
        tutorialKeys.spacebar.onDown.add(changeTXT())

        /*
        if (tutorialKeys.spacebar.onDown){

            if (tutorialTXT0.visible == true){
                removeTXT(tutorialTXT0);
                setVisibleFunc(tutorialTXT1);
            }
            else if (counter == 1){
                removeTXT(tutorialTXT1);
                setVisibleFunc(tutorialTXT2);

            }
        }
        */


        // create bullets group
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



        if (tutorialKeys.esc.isDown){
            game.state.start("menu")
        }
        // resting state for all corals on gameBoard
        for (i = 0; i <= 31; i += 1) {
            for (j = 0; j <= 31; j += 1) {
                if (typeof gameBoard[i][j] === 'object') {
                    if (gameBoard[i][j].id.slice(0, 1) === "c") {
                        if (defending) {
                            gameBoard[i][j].seekEnemies(crab, bullets)
                        } else {
                            gameBoard[i][j].resting();
                        }
                    }
                }
            }
        }

        // initial hard coding for enemy wave
        if(defending & gameOver == 0) {
            crabMove(crab, 0.25)
            game.physics.arcade.overlap(bullet, crab, crabHit)
            game.physics.arcade.overlap(crab, clam, clamHit)
        }
    }
};


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
    textbox.bringToTop();
    skipTXT.bringToTop();
    tutorialTXT0.bringToTop();
    tutorialTXT1.bringToTop();
    tutorialTXT2.bringToTop();
}

function removeTXT(text){
    text.destroy();
}

function setVisibleFunc(text){
    text.visible = true;
    counter+= 1;

}
function visibleTXT(TXTnumber, counter){
    TXTnumber.visible = false;
    
    counter+=1
    Txt_next = "tutorialTXT"+(counter+1);
    Txt_next.visible = true;



    }

/*
function testMessageBox() {
    w = game.width * 0.7
    h = game.height * 0.5
    this.showMessageBox("Welcome to Reef Defense!", w , h);

};

function showMessageBox(text, w , h ){
    //change this later to destroy txt, not box
    if (this.msgBox){
        this.msgBox.destroy();
    }
    var msgBox = game.add.group();
    var back = game.add.image("TXTbox");
    var text1 = game.add.text(0, 0, text);
    text1.wordWrap = true;
    text1.wordWrapWidth = w* .9;

    back.width = w;
    back.height = h;

    msgBox.add(back);
    msgBox.add(text1);

    msgBox.x = game.width / 2 - msgBox.width / 2;
    msgBox.y = game.height / 2 - msgBox.height / 2;

    text1.x = back.width / 2 - text1.width / 2;
    text1.y = back.height /2 - text1.height / 2;

    this.msgBox = msgBox;
};

function hideBox(){
    this.msgBox.destroy();
}

*/

function changeTXT(){
    tutorial_TXT.text = textList[counter]
    counter++

}
/*
function deleteTXT(){
    
}
*/