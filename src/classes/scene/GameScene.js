import sendPacket, { getPlayerID } from "../../io.js";
import Player from "../objects/Player.js";
import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class GameScene extends UpdatedScene {
	tilemap = {
		snow: null,
		ice: null,
		background: null,
		/** @type {Phaser.Tilemaps.TilemapLayer} */
		bridge: null
	};
	players = {};
	textureID = null;

	init(data) {
		this.textureID = data.textureID;
	}

	create() {
		this.background = this.add
			.image(480, 264, "background-sky")
			.setScrollFactor(0)
			.setTint(0xaaaaaa)
			.setDepth(-2);

		const map = this.createMap();

		const spawns = [];
		map.getObjectLayer("objects").objects.forEach(({ x, y, type }) => {
			switch (type) {
				case "player-spawn": {
					spawns.push({ x, y });
				}
			}
		});

		this.player = new Player(
			this,
			0,
			0,
			this.textureID,
			"ur self",
			spawns,
			true
		);
		this.player.setCollider(
			this.physics.add.collider(this.player, [
				this.tilemap.snow,
				this.tilemap.ice,
				this.tilemap.bridge
			])
		);

		this.player.spawn();

		const bounds = [16, 16, map.widthInPixels - 32, map.heightInPixels - 32];
		this.cameras.main
			.setZoom(3)
			.startFollow(this.player)
			.setBounds(...bounds);
		this.physics.world.setBounds(...bounds);

		this.scene.launch("HUD");
	}

	update() {
		super.update();

		const gameData = sendPacket(this.player.frameData);
		const pid = getPlayerID();

		if (gameData) {
			const removedPlayers = Object.keys(this.players);

			Object.entries(gameData.players).forEach(([id, data]) => {
				if (id !== pid) {
					if (this.players[id] == null) {
						this.players[id] = new Player(
							this,
							data.x,
							data.y,
							data.textureID,
							data.name,
							false
						);
					} else {
						removedPlayers.splice(removedPlayers.indexOf(id), 1);
					}

					this.players[id].frameData = data;
				}
			});

			removedPlayers.forEach((id) => {
				if (this.players[id] != null) {
					console.log("bye bye ENEMY");
					this.players[id].destroy();
					this.removeUpdate(this.players[id]);
					delete this.players[id];
				}
			});
		}
	}

	createMap() {
		const map = this.add.tilemap("map");
		map.addTilesetImage("Snow", "snow");
		map.addTilesetImage("Ice", "ice");
		map.addTilesetImage("Background", "background-tileset");
		map.addTilesetImage("Bridge", "bridge");
		map.addTilesetImage("Snowfort", "snowfort");

		this.tilemap.snow = map
			.createLayer("snow", "Snow")
			.setCollisionByProperty({ collide: true });
		this.tilemap.ice = map
			.createLayer("ice", "Ice")
			.setCollisionByProperty({ collide: true });
		this.tilemap.bridge = map.createLayer("bridge", "Bridge");
		this.tilemap.background = map
			.createLayer("background", ["Snowfort", "Background"])
			.setDepth(-1);

		this.tilemap.bridge
			.filterTiles((t) => t.index !== -1)
			.forEach((t) => {
				t.setCollision(false, false, true, false);
			});

		return map;
	}
}
