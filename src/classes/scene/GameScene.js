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

		this.load.tilemapTiledJSON("map", "tilemap/icy_peaks.json");
	}

	create() {
		this.anims.createFromAseprite("player1");

		const map = this.add.tilemap("map");
		map.addTilesetImage("Snow", "ground");
		const ground = map
			.createLayer("ground", "Snow")
			.setCollisionByProperty({ collide: true });

		const player = new Player(this, 0, 0, 1, true);
		this.physics.add.collider(player, ground);

		this.cameras.main
			.setZoom(3)
			.startFollow(player)
			.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	}
}
