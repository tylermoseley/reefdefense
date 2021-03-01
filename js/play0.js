var playState0 = {

    preload: function() {
        game.load.tilemap('Map2', 'Assets/Map/Map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
    },

    create: function () {
        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});

        var map = game.add.tilemap('Map2');
        map.addTilesetImage('Water');

        var baseLayer = map.createLayer('Tile Layer 1');
    },

    update: function() {

    }

};