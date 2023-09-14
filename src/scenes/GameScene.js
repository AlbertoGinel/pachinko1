//import Matter, { Collision } from "matter-js";
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.score = 50;
    this.MaxScore = 10;
  }

  preload() {
    this.load.image("sky", "assets/background.png");
    this.load.image("block1", "assets/block1.png");
    this.load.image("bearing", "assets/bearing.png");
    this.load.image("block2", "assets/block2.png");
    this.load.image("block3", "assets/block3.png");
    this.load.image("water", "assets/water.png");
  }

  create() {
    //this.world = new Matter.World();

    this.add.image(400, 300, "sky");

    //categories
    this.bearingCat = this.matter.world.nextCategory();
    this.waterCat = this.matter.world.nextCategory();

    //creates
    this.createWater();
    this.createPlatforms();

    //debug
    this.matter.world.createDebugGraphic();

    //bounds
    this.matter.world.setBounds(0, 0, 800, 600);

    //controls
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    //UI
    this.scoreText = this.add.text(16, 16, "" + this.score, {
      fontSize: "32px",
      fill: "#fff",
    });

    this.MaxscoreText = this.add.text(720, 16, "" + this.score, {
      fontSize: "32px",
      fill: "#ff1345",
    });

    this.matter.world.on("collisionstart", function (event, bodyA, bodyB) {
      //console.log("collision!!", bodyB);
    });
  }

  createPlatforms() {
    //this.matter.add.image(600, 400, "block1").setStatic(true);
    //this.matter.add.image(50, 250, "block1").setStatic(true);
    //.matter.add.image(750, 220, "block1").setStatic(true);

    this.matter.add.image(50, 600, "block2").setStatic(true).setAngle(45);

    this.matter.add.image(750, 600, "block2").setStatic(true).setAngle(135);
  }

  createBearingAt(x, y) {
    if (this.score > 0) {
      this.score = this.score - 1;
      this.scoreText.setText("" + this.score);
      const bearing = this.matter.add
        .sprite(x, y, "bearing")
        .setCollisionCategory(this.bearingCat) //A) defines the
        .setCollidesWith([this.waterCat, this.bearingCat]);

      bearing.setCircle(13);

      //looks like this isnt a proper Matter body, can you make it better??
      bearing.setBounce(0.9999);
      bearing.setFriction(0.0000000005); // You might want to set friction as well

      const angle = Phaser.Math.Between(20, 100) * (Math.PI / 180);

      // Define the desired magnitude
      const magnitude = 0.01;

      // Calculate the x and y components
      const xVec = magnitude * Math.cos(angle);
      const yVec = magnitude * Math.sin(angle);

      let vector = new Phaser.Math.Vector2(xVec, yVec);

      bearing.applyForce(vector);

      bearing.setOnCollideWith(this.water.body, (body, collisionData) => {
        console.log("water collision");
      });

      console.log(bearing);
    }
  }

  createWater() {
    this.water = this.matter.add
      .sprite(400, 595, "water")
      .setScale(0.5)
      .setCollisionCategory(this.waterCat)
      .setCollidesWith([this.bearingCat]);

    this.water.setStatic(true);
    this.water.setSensor(true);
  }

  updateMaxScore() {
    if (this.MaxScore < this.score) {
      this.MaxScore = this.score;
    }
  }

  update() {
    this.updateMaxScore();

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.createBearingAt(400, 15); // you can specify your desired coordinates here
    }
  }
}
