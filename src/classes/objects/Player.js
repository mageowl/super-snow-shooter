import Snowball from "./Snowball.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
	static SPEED = 140;
	static JUMP_HEIGHT = 250;
	static FIRE_VELOCITY = 300;
	static SLIDE_SPEED = 50;
	static local = null;

	isLocal = false;
	keys = null;
	anim = "idle";
	flip = false;
	textureName = "null";
	recoil = 0;
	sliding = false;
	launch = 0;
	crouch = false;

	constructor(scene, x, y, skin, local = false) {
		super(scene, x, y, `player${skin}`);

		scene.add.existing(this);
		scene.physics.add.existing(this);
		scene.updateObj(this);

		if (local) {
			this.isLocal = true;
			this.keys = this.scene.input.keyboard.addKeys("W,A,S,D,Space,SHIFT");
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
			const direction = input.D - input.A;

			if (this.launch <= 0 && !this.crouch)
				this.setVelocityX(Player.SPEED * direction);
			else if (this.launch > 0) {
				this.launch--;
			}

			this.crouch = input.SHIFT;

			if (this.body.onFloor() && input.W) {
				this.setVelocityY(-Player.JUMP_HEIGHT);
			}

			this.sliding =
				this.body.velocity.y >= 0 &&
				((this.body.blocked.right && input.D) ||
					(this.body.blocked.left && input.A));

			if (this.sliding) {
				this.setVelocityY(Player.SLIDE_SPEED);
				if (input.W) {
					this.setVelocity(Player.SPEED * -direction, -Player.JUMP_HEIGHT);
					this.launch = 30;
				}
			}

			if (input.S) {
				if (this.recoil === 0) {
					this.recoil = 10;
					new Snowball(this.scene, this.x, this.y + 4, [
						Player.FIRE_VELOCITY * -(this.flipX * 2 - 1),
						this.body.velocity.y / 10
					]);
				}
			} else if (this.recoil > 0) {
				this.recoil--;
			}

			if (this.body.onFloor()) {
				if ((input.D || input.A) && !this.crouch) {
					this.anim = "walk";
				} else if (this.recoil > 8) {
					this.anim = "shoot";
				} else {
					this.anim = "idle";
				}
			} else {
				if (this.sliding) {
					this.anim = "slide";
				} else if (this.body.velocity.y > 0) {
					this.anim = "fall";
				} else {
					this.anim = "jump";
				}
			}

			this.flip = { "-1": true, 0: this.flip, 1: false }[
				this.crouch ? direction : Math.sign(this.body.velocity.x)
			];
		}

		this.play(`${this.textureName}.${this.anim}`, true);
		this.setFlipX(this.flip);
	}
}
