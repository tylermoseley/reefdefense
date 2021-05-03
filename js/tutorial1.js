var counter = 0;
var balance = 100;

var tutorialState1 = {
    preload: function() {
        balance = 100, prices = [15 , 30, 45, 60]
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

