export default class Snowball extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, [xv, yv]) {
		super(scene, x, y, "snowball");

		scene.add.existing(this);
		scene.physics.add.existing();
	}
}
