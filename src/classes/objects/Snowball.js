export default class Snowball extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, [xv, yv]) {
		super(scene, x, y, "snowball");

		scene.add.existing(this);
		scene.physics.add.existing(this);
		scene.updateObj(this);
		scene.physics.add.collider(this, scene.tilemap.snow, this.hit);

		this.setVelocity(xv, yv).body.setAllowGravity(false).setGravityY(100);
		this.timer = 100;
	}

	update() {
		this.setAngle(
			Phaser.Math.Angle.Between(
				0,
				0,
				this.body.velocity.x,
				this.body.velocity.y
			)
		);

		this.timer--;
		if (this.timer === 85) {
			this.body.setAllowGravity(true);
		} else if (this.timer === 0) {
			this.hit();
		}
	}

	hit = () => {
		this.scene.removeUpdate(this);
		this.destroy();
	};
}
