var counter = 0;

var tutorialState1 = {
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
        ///game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});
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

        imageList = ["Clam", "Crab"]

        // center camera
        game.camera.x = ((32**2-game.width)/2);
        game.camera.y = ((32**2-game.height)/2);

        // set cursors variable to keyboard cursor input
        cursors = game.input.keyboard.createCursorKeys();

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

        tutorialTextList = [
            "Reef Defense is a tower defense game where the main objective is\n to build towers to protect the clam from the oncoming waves\n of enemies trying to steal the pearl",
            "Move the camera with w, a, s, d",
            "On the top right shows you the shop as well as your current gold",
            "Right next to each turrent is the amount of gold it costs",
            "To place turrents, press the corresponding number of the tower \nyou want to place",
            "Then use left mouse click to place it on the tile you want",
            "When you're ready to start the wave, click on the 'start' button",
            "Every wave will be more difficult than the last so plan well, \nand good luck!",
            "Press escape to return to the main menu"
        ]; 

        tutorial_TXT = game.add.text(game.width / 2 - 180, 10, "Welcome to Reef Defense!",{font: "16px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorial_TXT.fixedToCamera = true;
        tutorial_TXT.visible = true

        counter = 0

        tutorialKeys.spacebar.onDown.add(changeTXT);


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
        tutorial_TXT.bringToTop();

        
    },

}

function changeTXT(){
    tutorial_TXT.text = tutorialTextList[counter];
    counter +=1
}

