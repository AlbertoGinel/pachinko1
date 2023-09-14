import Phaser from "phaser";

import HelloWorldScene from "./HelloWorldScene";
import GameScene from "./scenes/GameScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 600,

  physics: {
    default: "matter",
    matter: {
      debug: true,
      gravity: {
        y: 0.5,
      },
    },
  },

  scene: [GameScene, HelloWorldScene],
};

export default new Phaser.Game(config);
