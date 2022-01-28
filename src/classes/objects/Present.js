import { hitPlayer } from "../../io.js";

export default class Present extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, v = null, parent = null) {
		super(scene, x, y, "present");

		scene.add.existing(this);
		scene.updateObj(this);
		if (v != null) {
			scene.physics.add.existing(this);
			scene.physics.add.collider(
				this,
				[scene.tilemap.snow, scene.tilemap.ice],
				this.hit
			);

			this.setVelocity(...v);
			this.timer = 100;
		}

		this.player = parent;
	}

	update() {
		if (this.player != null) {
			this.timer--;
			if (this.timer === 0) {
				this.hit();
			}
		}

		this.setRotation(this.rotation + 0.1);
	}

	hit = () => {
		Object.entries(this.scene.players)
			.filter(
				([_id, { x, y }]) =>
					Phaser.Math.Distance.Between(this.x, this.y, x, y) < 48
			)
			.forEach(([id, player]) => {
				console.log("Bam bam");
				if (!player.invincible && player.anim !== "hit") {
					hitPlayer(id);
				}
			});

		this.scene?.removeUpdate?.(this);
		this.destroy();
		this.player.snowballs.splice(this.player.snowballs.indexOf(this), 1);
	};
}
