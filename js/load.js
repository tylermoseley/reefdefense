var loadState = {

    preload: function () {

        /*
        Load all game assets
        load bar, some messages.
        In this case of loading, only text is placed...
        */

        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#fff'});

        //images, spritesheets, bitmaps...
        game.load.image('home-background', 'Assets/img/backgrounds/UnderWater.png');
        game.load.image('logo', 'Assets/img/reefdefenseLOGO.png');
        game.load.spritesheet('PlayButton', 'Assets/img/PlayButton/NewPlayButton.png', 160, 80)
        game.load.spritesheet('start', 'Assets/img/PlayButton/StartButton.png', 64, 32)
        game.load.image('shop_bar', 'Assets/img/backgrounds/Grey Bar.png')
        game.load.spritesheet('tower1', 'Assets/spritesheets/Red Anemone.png', 32, 40)
        game.load.spritesheet('tower2', 'Assets/spritesheets/Sea Star.png', 40, 40)
        game.load.spritesheet('tower3', 'Assets/spritesheets/Grass Coral.png', 32, 40)
        game.load.spritesheet('tower4', 'Assets/spritesheets/Money Coral.png', 32, 32)
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
        game.load.image('sand', 'Assets/Tilesets/sand.png');
        game.load.image('caveleft', 'Assets/Tilesets/caveleft.png');
        game.load.image('caveright', 'Assets/Tilesets/caveright.png');
        game.load.image('cavetop', 'Assets/Tilesets/cavetop.png');
        game.load.image('cavebottom', 'Assets/Tilesets/cavebottom.png');
        game.load.spritesheet('Crab', 'Assets/spritesheets/crabSheet.png', 320, 320);
        game.load.spritesheet('Bullet', 'Assets/spritesheets/bullet.png', 32, 64);
        game.load.image('Laser', 'Assets/Sprites/laser.png');
        game.load.spritesheet('Clam', 'Assets/spritesheets/clam.png', 64, 64);
        game.load.image('TXTbox', 'Assets/spritesheets/Textbox blue.png');
        game.load.spritesheet('Eel', 'Assets/spritesheets/Eel.png', 90, 32);
        game.load.spritesheet('Jellyfish', 'Assets/spritesheets/Jellyfish.png', 32, 32);
        game.load.spritesheet('Shark', 'Assets/spritesheets/SharkBoss.png', 223, 63);
        game.load.audio("music", "Assets/audio/kv-ocean.mp3");
        game.load.audio("laser", "Assets/audio/LaserShot.wav");
        game.load.spritesheet('towertower', 'Assets/img/Tower List.png', 32, 40);
        game.load.image('pausemenu', 'Assets/img/backgrounds/Pause Box.png');
        game.load.image('CameraKeys', 'Assets/Sprites/WASD keys.png', 66, 96);
        game.load.image('LMB', 'Assets/Sprites/Left Mouse.png', 61, 88);
        game.load.image('DeleteKey', 'Assets/Sprites/Delete Key.png', 35, 73);
        game.load.spritesheet('tutorialButton', 'Assets/img/PlayButton/NewTutButton.png', 160, 80)
        game.load.spritesheet('playAgainButton', 'Assets/img/PlayButton/PlayAgain.png', 160, 80)
        game.load.image('gold', 'Assets/spritesheets/gold coin.png')

        //bosses
        game.load.spritesheet('Crab_Boss', 'Assets/spritesheets/Crab Boss.png', 32, 32);
        game.load.spritesheet('Jellyfish_Boss', 'Assets/spritesheets/Jellyfish Boss.png', 32, 32);
        game.load.spritesheet('Eel_Boss', 'Assets/spritesheets/Eel Boss.png', 90, 32);
        //sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');
        game.load.audio('ClamBubbles', 'Assets/audio/ClamBubbles.mp3')
        game.load.audio('PopSound', 'Assets/audio/PopSound.mp3')
        game.load.audio('GameOver', 'Assets/audio/GameOver.wav')
        game.load.audio('MoneyBag', 'Assets/audio/MoneyBag.wav')
        game.load.audio('Zap', 'Assets/audio/electricZap.wav')
        game.load.audio('Crunch', 'Assets/audio/crunch.mp3')

        //data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function () {
        game.stage.setBackgroundColor('#000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
