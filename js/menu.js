var menuState = {
    preload: function(){
        game.load.spritesheet("bubble", "Assets/spritesheets/Water Bubble.png", 32, 32)
        game.load.audio("button", "Assets/audio/zapsplat_multimedia_button_click_007_53868.mp3");
        game.load.audio("music", "Assets/audio/kv-ocean.mp3");
    },
    create: function () {

        // game.add.plugin(Phaser.Plugin.Debug);
        // game.add.plugin(Phaser.Plugin.Inspector);
        // game.add.plugin(PhaserSuperStorage.StoragePlugin);
        // game.add.plugin(PhaserInput.Plugin);
        //BG_music = game.add.audio("music");
        //BG_music.play("", 0, .2, true);

        game.add.image(0, 0, 'home-background');
        game.add.image(160, 0, 'logo')
        startButton = game.add.button(320, 260, 'PlayButton', startGame, this, 1, 0, 2);
        tutorial_button = game.add.button(320, 360, 'tutorialButton', tutorialStage, this, 1, 0, 2);
        // tutorial_button.scale.setTo(10,4)

    
        // bubble = game.add.sprite(200, 200, "bubble");
        // bubble.scale.setTo(1.5, 1.5)
        // bubble.animations.add("ripple", [0,3]);
        
    },
    update: function(){
        // bubble.animations.play("ripple", 4, true)
    }
};
function startGame () {
    var snd = game.add.audio("button");
    snd.play();
    game.state.start('play0');
    
}

function tutorialStage () {
    var snd = game.add.audio("button");
    snd.play();
    game.state.start('tutorial1');
}
