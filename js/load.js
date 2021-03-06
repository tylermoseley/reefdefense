var loadState = {

    preload: function () {

        /*
        Load all game assets
        load bar, some messages.
        In this case of loading, only text is placed...
        */

        var loadingLabel = game.add.text(80, 150, 'loading...', {font: '30px Courier', fill: '#fff'});

        //images, spritesheets, bitmaps...
        game.load.image('home-background', 'assets/img/backgrounds/UnderWater.png');
        game.load.atlasJSONHash('PlayButton', 'Assets/img/PlayButton/PlayButton.png', 'Assets/img/PlayButton/PlayButton.json')
        game.load.spritesheet("clam", "Assets/Sprites/QueenClam80.png", 80, 80)
        game.load.image('start', 'Assets/img/start.png')

        //sounds, efx, music...
        //Example: game.load.audio('rockas', 'assets/snd/rockas.wav');

        //data, JSON, Querys...
        //Example: game.load.json('version', 'http://phaser.io/version.json');

    },

    create: function () {
        game.stage.setBackgroundColor('#000');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.state.start('menu');
    }
};
