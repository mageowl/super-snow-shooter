export default class Player extends Phaser.Physics.Arcade.Sprite {
	static SPEED = 140;
	static JUMP_HEIGHT = 250;

	static local = null;

	isLocal = false;
	keys = null;
	anim = "idle";
	flip = false;
	textureName = "null";
	recoil = 0;

	constructor(scene, x, y, skin, local = false) {
		super(scene, x, y, `player${skin}`);

		scene.add.existing(this);
		scene.physics.add.existing(this);
		scene.updateObj(this);

		if (local) {
			this.isLocal = true;
			this.keys = this.scene.input.keyboard.addKeys("W,A,S,D,Space");
			Player.local = this;
		}
		this.textureName = `player${skin}`;

		this.setSize(9, 16).setOffset(4, 8);
	}

	update() {
		if (this.isLocal) {
			const input = Object.fromEntries(
				Object.entries(this.keys).map(([name, { isDown }]) => [name, isDown])
			);

			this.setVelocityX((input.D - input.A) * Player.SPEED);

			if (this.body.onFloor() && input.W) {
				this.setVelocityY(-Player.JUMP_HEIGHT);
			}

			if (input.S) {
				if (this.recoil === 0) {
					this.recoil = 10;
					// Shoot snowball
				}
			} else if (this.recoil > 0) {
				this.recoil--;
			}

			if (this.body.onFloor()) {
				if (input.D || input.A) {
					this.anim = "walk";
				} else if (this.recoil > 8) {
					this.anim = "shoot";
				} else {
					this.anim = "idle";
				}
			} else {
				if (this.body.velocity.y > 0) {
					this.anim = "fall";
				} else {
					this.anim = "jump";
				}
			}

			this.flip = input.D ? false : input.A ? true : this.flip;
		}

		this.play(`${this.textureName}.${this.anim}`, true);
		this.setFlipX(this.flip);
	}
}
