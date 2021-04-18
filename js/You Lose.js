

lossState ={
    preload: function() {
        game.load.tilemap('Map0', 'Assets/Map/Map0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Water', 'Assets/Tilesets/water_tileset.png');
        game.load.image('sand', 'Assets/Tilesets/sand.png');
        game.load.image('caveleft', 'Assets/Tilesets/caveleft.png');
        game.load.image('caveright', 'Assets/Tilesets/caveright.png');
        game.load.image('cavetop', 'Assets/Tilesets/cavetop.png');
        game.load.image('cavebottom', 'Assets/Tilesets/cavebottom.png');

},
    create: function () {
        // game.add.plugin(Phaser.Plugin.Debug);

        
        // tile map and layers
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

        startButton = game.add.button(512-80, 512-40, 'playAgainButton', startGame, this, 1, 0, 2);

        cursors = game.input.keyboard.createCursorKeys();
        
        leaveKey = {
            esc: game.input.keyboard.addKey(Phaser.Keyboard.ESC),
        }


        moneyTXT = game.add.text(720, 200, "You Lose!\n Press Escape to return to main menu", {font: "40px Arial", fill: "#ffffff", align: "center" });
        moneyTXT.fixedToCamera = true;
        moneyTXT.anchor.setTo(1,1)


},

    update: function() {
        if(leaveKey.esc.isDown){
            game.state.start("menu")
        }
}
};

function startGame () {
    var snd = game.add.audio("button");
    snd.play();
    game.state.start('play0');

}