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
        game.load.atlasJSONHash('PlayButton', 'Assets/img/PlayButton/PlayButton.png', 'Assets/img/PlayButton/PlayButton.json')
        game.load.image('start', 'Assets/img/start.png')
        game.load.image('shop_bar', 'Assets/img/backgrounds/Grey Bar.png')
        game.load.spritesheet('tower1', 'Assets/spritesheets/Red Anemone.png', 32, 40)
        game.load.spritesheet('tower2', 'Assets/spritesheets/Blue Coral Circle.png', 32, 32)
        game.load.spritesheet('tower3', 'Assets/spritesheets/Grass Coral.png', 32, 40)
        game.load.image('gold', 'Assets/spritesheets/gold placeholder.png')
        
        game.load.image('tutorialButton', 'Assets/img/PlayButton/Tutorial button.png')

        //sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');
        game.load.audio('ClamBubbles', 'Assets/audio/ClamBubbles.mp3')
        game.load.audio('PopSound', 'Assets/audio/PopSound.mp3')
        game.load.audio('GameOver', 'Assets/audio/GameOver.wav')
        game.load.audio('MoneyBag', 'Assets/audio/MoneyBag.wav')

        //data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function () {
        game.stage.setBackgroundColor('#000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
