playState0 = {

    preload: function() {
        game.load.tilemap('Map2', 'Assets/Map/Map2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
    },

    create: function () {
        game.add.plugin(Phaser.Plugin.Debug);

        game.add.text(80, 150, 'loading game ...', {font: '30px Courier', fill: '#fff'});

        map = game.add.tilemap('Map2');
        map.addTilesetImage('Water');

        layer = map.createLayer('Tile Layer 1');

        layer.resizeWorld();

        //  hover box
        marker = game.add.graphics();
        marker.lineStyle(2, "0xFFFFFF", 1);
        marker.drawRect(0, 0, 32, 32);

        // call updateMarker when mouse is moved
        game.input.addMoveCallback(updateMarker, this);

        // call getTileProperties function when tile is clicked
        game.input.onDown.add(getTileProperties, this);

        // set cursors variable to keyboard cursor input
        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function() {

        // move camera with cursors with "speed" set
        // (setting to factors of 32 makes it hard to see movement)
        scrollSpd = 8
        if (cursors.left.isDown) {
            game.camera.x -= scrollSpd;
        } else if (cursors.right.isDown) {
            game.camera.x += scrollSpd;
        }
        if (cursors.up.isDown) {
            game.camera.y -= scrollSpd;
        } else if (cursors.down.isDown) {
            game.camera.y += scrollSpd;
        }
    }
}

// main handler for mouse clicks
function getTileProperties() {
    x = layer.getTileX(game.input.activePointer.worldX);
    y = layer.getTileY(game.input.activePointer.worldY);

    tile = map.getTile(x, y, layer);

    // Note: JSON.stringify will convert the object tile properties to a string
    currentDataString = JSON.stringify( tile.properties );
    tile.properties.wibble = true;

    if(currentDataString){
        game.debug.text('Tile properties: ' + currentDataString + "("+x+","+y+")", 16, 16);
    } else {
        game.debug.text("Click on a tile to reveal the properties of the tile", 16, 16);
    }
}

// display rectangle on mouse location
function updateMarker() {
    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
}