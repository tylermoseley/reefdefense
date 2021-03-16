var w = 800, h = 750;

/*
For Fullscreen put this code:

var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;
*/

var config = {
    width: 800,
    height: 600,
    renderer: Phaser.Auto,
    parent: 'gameContainer',
    mouseWheel: true
}

var game = new Phaser.Game(config);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play0', playState0);
game.state.add('tutorial', tutorialState)

game.state.start('boot');
