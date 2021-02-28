var menuState = {

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
    game.state.start('play0');
}
