import sendPacket, { getRemovedPlayers, getPlayerID } from "../../io.js";
import Player from "../objects/Player.js";
import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class GameScene extends UpdatedScene {
	tilemap = {
		snow: null,
		ice: null
	};
	players = {};

	preload() {
		this.load.aseprite(
			"player1",
			"sprites/player/player1.png",
			"sprites/player/player1.json"
		);

		this.load.image("snowball", "sprites/player/snowball.png");

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

		this.player = new Player(this, 0, 0, 1, true);
		this.physics.add.collider(this.player, [
			this.tilemap.snow,
			this.tilemap.ice
		]);

		this.cameras.main
			.setZoom(3)
			.startFollow(this.player)
			.setBounds(16, 16, map.widthInPixels - 32, map.heightInPixels - 32);
	}

	update() {
		super.update();

		const gameData = sendPacket(this.player.frameData);
		const pid = getPlayerID();
		const removedPlayers = getRemovedPlayers();
		if (removedPlayers.length > 0) console.log("ppl who ded: ", removedPlayers);

		if (gameData) {
			Object.entries(gameData.players).forEach(([id, data]) => {
				if (id !== pid) {
					if (this.players[id] == null) {
						this.players[id] = new Player(this, data.x, data.y, 1, false);
						console.log("friend!");
					}

					this.players[id].frameData = data;
				}
			});

			removedPlayers.forEach((id) => {
				console.log("bye bye ENEMY");
				this.players[id].destroy();
				this.removeUpdate(this.players[id]);
				delete this.players[id];
			});
		}
	}
}
