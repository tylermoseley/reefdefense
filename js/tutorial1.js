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

        tower4_button = game.add.sprite(728, 160, 'tower4');
        tower4_button.fixedToCamera = true;
        tower4_button.anchor.setTo(0, 0);
        tower4_button.scale.setTo(1,1);
        tower4_button.animations.add('idle4', [0,1,2,3]);

        tower4_cost = game.add.text(795, 165, "Press 4\n40G", {font: "10px Arial", text: "bold()", fill: "#000000", align: "right"})
        tower4_cost.fixedToCamera = true;
        tower4_cost.anchor.setTo(1,0)

        textbox = game.add.sprite(90, 00, "TXTbox");
        textbox.fixedToCamera = true;
        textbox.scale.setTo(7.4, 3.9);

        tutorialTextList = [
            "Move the camera with 'W' 'A' 'S' 'D'",
            "Reef defense is a wave based tower defense where each wave\nhas a set number of enemies to destroy before the next wave \nstarts",
            "Every wave, enemies such as crabs, eels, etc. will spawn from any \nof the four caves and all enemies are after your clam",
            "To protect the clam, you need to place down corals, which will act\n as your towers. These corals will automatically shoot pellets\n towards incoming enemies, dealing damage",
            "Different corals have different stats such as health, shooting speed,\nand range. Shooting speed indicates how fast a tower shoots each\npellet. Range indicates how far the coral can target enemies",
            "To select the coral you want to place, press the corresponding\nnumber of the coral, this is defaulted to the red coral if\n no number is pressed",
            "Hovering the selected coral over a tile will show the coral's range",
            "Left mouse click will place the selected coral onto any water tiles.\n Keep in mind, that you need to have enough gold to place the \ncoral. Sand tiles, as well as caves tiles, cannot be built on top of.",
            "On the top right is the shop as well as your current gold.\nRight next to each coral is the amount of gold it costs",
            "The player will start with 100 gold coins.",
            "To earn gold, killing an enemy will net the player 5 gold \nper enemy destroyed. The gold coral will also give you 20 gold at\nthe end of every round per gold coral.",
            "To sell a coral, click on the coral you want to get rid of.\n A white box should appear, indicating that it is selected\nThen press the 'delete' key to sell the tower for half the \ncost of the tower",            
            "When you're ready to start the wave, click on the 'start' button",
            "Every wave will be more difficult than the last so plan well, \nand good luck!",
            "Press escape to return to the main menu"
        ]; 

        tutorial_TXT = game.add.text(game.width / 2 - 297, 10, "Welcome to Reef Defense!",{font: "20px Arial", text: "bold()", fill: "#ffffff", align: "left"})
        tutorial_TXT.fixedToCamera = true;
        tutorial_TXT.visible = true

        counter = 0

        tutorialKeys.spacebar.onDown.add(changeTXT);
        skipTXT = game.add.text(250 , 170, "press spacebar to proceed, press esc to exit to main menu",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} )
        skipTXT.fixedToCamera = true;

        ControlBox = game.add.image(90, 420, 'TXTbox')
        ControlBox.scale.setTo(7.4,4);
        ControlBox.fixedToCamera = true;
        ControlBox.bringToTop()

        ControlsTXT = game.add.text(350, 430, "Keybindings",{font: "20px Arial", text: "bold()", fill: "#ffffff", align: "left"} );
        ControlsTXT.fixedToCamera = true;
        ControlsTXT.bringToTop();

        CameraTXT = game.add.text(110, 480, "Camera Controls",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} );
        CameraTXT.fixedToCamera = true;
        CameraTXT.bringToTop();

        Camera = game.add.image(110, 510,'CameraKeys')
        Camera.scale.setTo(1.2, 1.2)
        Camera.fixedToCamera = true;
        Camera.bringToTop()

        LmbTXT = game.add.text(280, 480, "Place/Buy Coral",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} );
        LmbTXT.fixedToCamera = true;
        LmbTXT.bringToTop();

        LeftMouseButton = game.add.image(300, 510,'LMB')
        LeftMouseButton.scale.setTo(1.1, 1.0)
        LeftMouseButton.fixedToCamera = true;
        LeftMouseButton.bringToTop()

        DeleteTXT = game.add.text(450, 480, "Sell Coral \n(need to click on coral first)",{font: "16px Arial", text: "bold()", fill: "#000000", align: "left"} )
        DeleteTXT.fixedToCamera = true;
        DeleteTXT.bringToTop();

        DeleteKey= game.add.image(500, 520,'DeleteKey')
        DeleteKey.scale.setTo(1.1, 1.0)
        DeleteKey.fixedToCamera = true;
        DeleteKey.bringToTop()
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
        tower4_button.bringToTop();
        tower4_cost.bringToTop();
        textbox.bringToTop();
        skipTXT.bringToTop();
        tutorial_TXT.bringToTop();
        Camera.bringToTop();

        
    },

}

function changeTXT(){
    tutorial_TXT.text = tutorialTextList[counter];
    counter +=1
}

