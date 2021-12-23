export default class Snowball extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, v = null, parent = null) {
		super(scene, x, y, "snowball");

		scene.add.existing(this);
		if (v != null) {
			scene.physics.add.existing(this);
			scene.updateObj(this);
			scene.physics.add.collider(this, scene.tilemap.snow, this.hit);

			this.setVelocity(...v)
				.body.setAllowGravity(false)
				.setGravityY(100);
			this.timer = 100;
		}

		this.player = parent;
	}

	update() {
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
		this.player.snowballs.splice(this.player.snowballs.indexOf(this), 1);
	};
}
