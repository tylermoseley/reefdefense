var w = 800, h = 600;

/*
For Fullscreen put this code:

var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;
*/

var config = {
    width: w,
    height: h,
    renderer: Phaser.Auto,
    parent: 'gameContainer',
    mouseWheel: true
}

var game = new Phaser.Game(config);

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play0', playState0);
game.state.add('tutorial', tutorialState);
game.state.add('tutorial1', tutorialState1);
game.state.add("loss", lossState);
game.state.add("win", winState);

game.state.start('boot');
