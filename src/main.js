// Tien Le
// Created 4/27/24
// CMPM 120

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,
    height: 600,
    scene: [Title, Movement],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);