var menuState = {
    preload: function(){
        game.load.audio("button", "reefdefense\Assets\audio\zapsplat_multimedia_button_click_007_53868.mp3");
        game.load.audio("music", "reefdefense\Assets\audio\kv-ocean.mp3");
    },
    create: function () {

        // game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        // game.add.plugin(PhaserInput.Plugin);
        
        game.add.image(0, 0, 'home-background');
        game.add.button(250, 338, 'PlayButton', startGame, this, 2, 1, 0);

    }
};
function startGame () {
    var snd = game.add.audio("button");
    snd.play();
    game.state.start('play0');
    
}
