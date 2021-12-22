import Player from "../objects/Player.js";
import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class GameScene extends UpdatedScene {
	tilemap = {
		snow: null,
		ice: null
	};

	preload() {
		this.load.aseprite(
			"player1",
			"sprites/player/player1.png",
			"sprites/player/player1.json"
		);

		this.load.image("snowball", "sprites/other/snowball.png");

		this.load.image("snow", "sprites/tileset/ground.png");
		this.load.image("ice", "sprites/tileset/ice.png");

		this.load.tilemapTiledJSON("map", "tilemap/icy_peaks.json");
	}

	create() {
		this.anims.createFromAseprite("player1");

		const map = this.add.tilemap("map");
		map.addTilesetImage("Snow", "snow");
		map.addTilesetImage("Ice", "ice");

		this.tilemap.snow = map
			.createLayer("snow", "Snow")
			.setCollisionByProperty({ collide: true });
		this.tilemap.ice = map
			.createLayer("ice", "Ice")
			.setCollisionByProperty({ collide: true });

		const player = new Player(this, 0, 0, 1, true);
		this.physics.add.collider(player, [this.tilemap.snow, this.tilemap.ice]);

		this.cameras.main
			.setZoom(3)
			.startFollow(player)
			.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	}
}
