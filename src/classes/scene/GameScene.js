import sendPacket, {
	getRemovedPlayers,
	getPlayerID,
	onDeath
} from "../../io.js";
import Player from "../objects/Player.js";
import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class GameScene extends UpdatedScene {
	tilemap = {
		snow: null,
		ice: null,
		background: null
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
		this.load.image("snowfort", "sprites/tileset/snowfort.png");

		this.load.tilemapTiledJSON("map", "tilemap/icy_peaks.json");

		this.load.image("background-sky", "sprites/background/sky.png");

		this.load.bitmapFont(
			"zepto-name-tag",
			"font/zepto-name-tag.png",
			"font/zepto-name-tag.xml"
		);
	}

	create() {
		this.anims.createFromAseprite("player1");

		this.background = this.add
			.image(480, 264, "background-sky")
			.setScrollFactor(0)
			.setTint(0xaaaaaa);

		const map = this.add.tilemap("map");
		map.addTilesetImage("Snow", "snow");
		map.addTilesetImage("Snowfort", "snowfort");
		map.addTilesetImage("Ice", "ice");

		this.tilemap.snow = map
			.createLayer("snow", "Snow")
			.setCollisionByProperty({ collide: true });
		this.tilemap.ice = map
			.createLayer("ice", "Ice")
			.setCollisionByProperty({ collide: true });
		this.tilemap.background = map
			.createLayer("background", ["Snowfort"])
			.setCollisionByProperty({ collide: true });

		const spawns = [];
		map.getObjectLayer("objects").objects.forEach(({ x, y, type }) => {
			switch (type) {
				case "player-spawn": {
					spawns.push({ x, y });
				}
			}
		});

		this.player = new Player(this, 0, 0, 1, "urself", true);
		this.physics.add.collider(this.player, [
			this.tilemap.snow,
			this.tilemap.ice
		]);

		const spawn = spawns[Math.floor(Math.random() * spawns.length)];
		this.player.setPosition(spawn.x, spawn.y);

		onDeath(() => {
			const spawn = spawns[Math.floor(Math.random() * spawns.length)];
			this.player.setPosition(spawn.x, spawn.y);
			this.player.invincible = true;
		});

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
						this.players[id] = new Player(
							this,
							data.x,
							data.y,
							1,
							data.name,
							false
						);
						console.log(data.name, " is a friend!");
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
}
