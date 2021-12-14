import Player from "../objects/Player.js";
import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class GameScene extends UpdatedScene {
	preload() {
		this.load.aseprite(
			"player1",
			"sprites/player/player1.png",
			"sprites/player/player1.json"
		);

		this.load.image("ground", "sprites/tileset/ground.png");
	}

	create() {
		this.anims.createFromAseprite("player1");

		const player = new Player(this, 0, 0, 1, true);
		this.physics.add.collider(
			[
				this.physics.add.staticImage(0, 100, "ground"),
				this.physics.add.staticImage(48, 100, "ground")
			],
			player
		);

		this.cameras.main.setZoom(3).startFollow(player);
	}
}
