var map, layer, marker, cursors, currentDataString, title

var playState0 = {

    preload: function() {
        game.load.tilemap('Map2', 'Assets/Map/Map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
    },

    create: function () {
        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});

        map = game.add.tilemap('Map2');
        map.addTilesetImage('Water');

        layer = map.createLayer('Tile Layer 1');

        layer.resizeWorld();

        //  Our painting marker
        marker = game.add.graphics();
        marker.lineStyle(2, 0xffffff, 1);
        marker.drawRect(0, 0, 32, 32);

        game.input.addMoveCallback(updateMarker, this);

        game.input.onDown.add(getTileProperties, this);

        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {
        if (cursors.left.isDown)
        {
            game.camera.x -= 4;
        }
        else if (cursors.right.isDown)
        {
            game.camera.x += 4;
        }

        if (cursors.up.isDown)
        {
            game.camera.y -= 4;
        }
        else if (cursors.down.isDown)
        {
            game.camera.y += 4;
        }
    }

}

function getTileProperties() {

    x = layer.getTileX(game.input.activePointer.worldX);
    y = layer.getTileY(game.input.activePointer.worldY);

    tile = map.getTile(x, y, layer);

    // Note: JSON.stringify will convert the object tile properties to a string
    currentDataString = JSON.stringify( tile.properties );

    tile.properties.wibble = true;

}

function updateMarker() {

    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

}

function render() {

    if(currentDataString){
        game.debug.text('Tile properties: ' + currentDataString, 16, 550);
    } else {
        game.debug.text("Click on a tile to reveal the properties of the tile", 16, 550);
    }
}