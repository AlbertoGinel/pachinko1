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
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("hero", "assets/hero.png");
    this.load.image("enemy2", "assets/enemy2.png");
    this.load.image("hero2", "assets/hero2.png");
  }

  create() {
    //this.world = new Matter.World();

    this.add.image(400, 300, "sky");

    //categories
    this.bearingCat = this.matter.world.nextCategory();
    this.waterCat = this.matter.world.nextCategory();
    this.platformCat = this.matter.world.nextCategory();
    this.enemyCat = this.matter.world.nextCategory();
    this.heroCat = this.matter.world.nextCategory();

    //debug
    //this.matter.world.createDebugGraphic();

    //bounds
    this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, true, true);
    //setBounds([x], [y], [width], [height], [thickness], [left], [right], [top], [bottom])

    //this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
    //this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);
    //this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, false, true);

    //creates
    this.createWater();
    this.createEnemy();
    this.createHero();
    this.createPlatforms();

    this.time.addEvent({
      delay: 500, // every 1000 ms
      callback: this.createBearingTiming,
      callbackScope: this, // bind to the scene's context
      loop: true, // will repeat indefinitely
    });

    //controls
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    //UI
    this.scoreText = this.add.text(50, 20, String(this.score), {
      fontSize: "32px",
      color: "#fff",
    });
  }

  createBearingTiming() {
    this.createBearingAt(400, 50); // You already have this function, based on the previous code snippets you shared
  }

  createPlatforms() {
    const places = [
      [100, 100],
      [100, 200],
      [100, 300],
      [200, 100],
      [200, 200],
      [200, 300],
      [200, 400],
      [300, 100],
      [300, 200],
      [300, 300],
      [300, 400],
      [400, 200],
      [400, 300],
      [400, 400],
      [500, 100],
      [500, 200],
      [500, 300],
      [500, 400],
      [600, 100],
      [600, 200],
      [600, 300],
      [600, 400],
      [700, 100],
      [700, 200],
      [700, 300],
    ];

    places.forEach(([x, y]) => {
      this.matter.add
        .image(x, y, "block1")
        .setStatic(true)
        .setAngle(45)
        .setScale(0.9)
        .setCollisionCategory(this.platformCat)
        .setCollidesWith([this.bearingCat]);
    });

    this.matter.add
      .image(50, 600, "block2")
      .setStatic(true)
      .setAngle(45)
      .setCollisionCategory(this.platformCat)
      .setCollidesWith([this.bearingCat]);

    this.matter.add
      .image(750, 600, "block2")
      .setStatic(true)
      .setAngle(135)
      .setCollisionCategory(this.platformCat)
      .setCollidesWith([this.bearingCat]);

    this.matter.add
      .image(900, 100, "block2")
      .setStatic(true)
      .setAngle(90)
      .setCollisionCategory(this.platformCat)
      .setCollidesWith([this.bearingCat]);

    this.matter.add
      .image(-100, 100, "block2")
      .setStatic(true)
      .setAngle(270)
      .setCollisionCategory(this.platformCat)
      .setCollidesWith([this.bearingCat]);
  }

  updateScore(value) {
    this.score = this.score + value;
    this.scoreText.setText(this.score.toString());
  }

  createBearingAt(x, y) {
    if (this.score > 0) {
      this.updateScore(-1);
      const bearing = this.matter.add.sprite(x, y, "bearing");

      //  Calling `setCircle` will reset the entire body, clearing its collision masks, etc
      bearing.setCircle(13);

      //  So you have to set them _after_ changing the body shape
      bearing.setCollisionCategory(this.bearingCat); //A) defines the
      bearing.setCollidesWith([
        this.waterCat,
        this.bearingCat,
        this.platformCat,
        this.enemyCat,
        this.heroCat,
      ]);

      bearing.setBounce(0.9999);
      bearing.setFriction(0.0000000005).setFixedRotation();

      const degreeAngle = Phaser.Math.Between(20, 160);

      //const degreeAngle = 300;

      // Convert angle to radians
      const angle = Phaser.Math.DegToRad(degreeAngle);

      // Define the desired magnitude
      const magnitude = 0.02;

      // Calculate the x and y components
      const xVec = magnitude * Math.cos(angle);
      const yVec = magnitude * Math.sin(angle);

      let vector = new Phaser.Math.Vector2(xVec, yVec);

      bearing.applyForce(vector);

      bearing.setOnCollideWith(this.water.body, (body, collisionData) => {
        this.updateScore(+1);
        bearing.destroy();
      });

      bearing.setOnCollideWith(this.enemy.body, (body, collisionData) => {
        //trigger this enemy to make them animate
        this.animateEnemy();
        bearing.destroy();
      });

      bearing.setOnCollideWith(this.hero.body, (body, collisionData) => {
        this.updateScore(+2);
        this.animateHero();
        bearing.destroy();
      });
    }
  }

  createHero() {
    this.hero = this.matter.add.sprite(400, 550, "hero");

    this.hero.setCircle(115);

    this.hero
      .setScale(0.4)
      .setCollisionCategory(this.heroCat)
      .setCollidesWith([this.bearingCat]);

    this.hero.setStatic(true);
    this.hero.setSensor(true);
    this.startWandering(this.hero);
  }

  animateEnemy() {
    this.enemy.setTexture("enemy2");

    this.time.delayedCall(250, () => {
      this.enemy.setTexture("enemy");
    });
  }

  animateHero() {
    this.hero.setTexture("hero2");

    this.time.delayedCall(250, () => {
      this.hero.setTexture("hero");
    });
  }

  createEnemy() {
    this.enemy = this.matter.add.sprite(400, 550, "enemy");

    this.enemy.setCircle(115);

    this.enemy
      .setScale(0.4)
      .setCollisionCategory(this.enemyCat)
      .setCollidesWith([this.bearingCat]);

    this.enemy.setStatic(true);
    this.enemy.setSensor(true);
    this.startWandering(this.enemy);
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

  startWandering(object) {
    const minDuration = 1000; // Minimum time (in ms) to reach target
    const maxDuration = 5000; // Maximum time (in ms) to reach target

    const maxDistance = 200;
    const minX = object.x - maxDistance;
    const maxX = object.x + maxDistance;
    const targetX = Phaser.Math.Between(minX, maxX);
    const duration = Phaser.Math.Between(minDuration, maxDuration);

    this.tweens.add({
      targets: object,
      x: targetX,
      duration: duration,
      yoyo: true, // Go back to original position after reaching target
      onComplete: () => {
        this.startWandering(object); // Restart wandering once the tween completes
      },
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.createBearingAt(400, 50); // you can specify your desired coordinates here
    }
  }
}
