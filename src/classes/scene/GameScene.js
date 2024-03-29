import { ERROR } from "../../../errorCodes.mjs";
import sendPacket, { getPlayerID, onWin } from "../../io.js";
import Player from "../objects/Player.js";
import animParticles from "../other/AnimatedParticle.js";
import UpdatedScene from "../template/scenes/UpdatedScene.js";
import HUD from "./HUD.js";

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
	particles = {
		config: {}
	};
	sfx = {};
	winMode = false;

	init(data) {
		this.textureID = data.textureID;
	}

	create() {
		this.winMode = false;

		this.background = this.add
			.image(480, 264, "background-sky")
			.setScrollFactor(0.3)
			.setScale(2)
			.setTint(0xbbbbbb)
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

		this.createParticles();
		this.createSounds();

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
			.startFollow(this.player, false, 0.1, 0.1)
			.setBounds(...bounds);
		this.physics.world.setBounds(...bounds);

		this.scene.launch("HUD");

		this.input.keyboard.on("keydown-ESC", () => {
			this.scene.start("MainMenu");
			this.scene.stop("HUD");
		});

		onWin((playerID) => {
			this.winMode = true;
			const won = playerID === getPlayerID();
			const winner = won ? this.player : this.players[playerID];
			this.player.setVisible(false).body.setEnable(false);
			if (!won) {
				this.cameras.main.startFollow(this.player, false, 0.1, 0.1);
			}
			setTimeout(() => this.player.setPosition(winner.x, winner.y), 10);
			Object.values(this.players).forEach((p) => p.setVisible(false));
			winner.setVisible(true);
			this.add.image(winner.x, winner.y - (won ? 20 : 28), "crown");
			this.player.cancelRespawn();
		});
	}

	update() {
		if (!this.winMode) {
			super.update();

			const gameData = sendPacket(this.player.frameData);
			const pid = getPlayerID();

			if (gameData !== ERROR.NOT_CONNECTED && gameData != null) {
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
						this.players[id].destroy();
						this.removeUpdate(this.players[id]);
						delete this.players[id];
					}
				});
			}
		}
	}

	createMap() {
		const map = this.add.tilemap("map");
		map.addTilesetImage("Snow", "snow", 16, 16, 1, 2);
		map.addTilesetImage("Ice", "ice", 16, 16, 1, 2);
		map.addTilesetImage("Background", "background-tileset", 16, 16, 1, 2);
		map.addTilesetImage("Bridge", "bridge");
		map.addTilesetImage("Snowfort", "snowfort");

		this.tilemap.snow = map
			.createLayer("snow", "Snow")
			.setCollisionByProperty({ collide: true });
		this.tilemap.ice = map
			.createLayer("ice", "Ice")
			.setCollisionByProperty({ collide: true });
		this.tilemap.bridge = map.createLayer("bridge", "Bridge");
		this.tilemap.snowDrift = map
			.createLayer("snow-drift", "Background")
			.setDepth(-1);
		this.tilemap.background = map
			.createLayer("background", ["Snowfort", "Background"])
			.setDepth(-2);

		this.tilemap.bridge
			.filterTiles((t) => t.index !== -1)
			.forEach((t) => {
				t.setCollision(false, false, true, false);
			});

		return map;
	}

	createParticles() {
		this.particles.present = this.add.particles("present-explosion");
		this.particles.config.present = {
			frame: {
				frames: [0, 1],
				cycle: true,
				quantity: 1
			},
			gravityY: 400,
			speed: { min: 75, max: 125 },
			angle: { min: 0, max: 360 },
			lifespan: 1000,
			rotate: { min: 0, max: 360 },
			maxParticles: 2
		};

		this.particles.bang = this.add.particles("bang");
		this.particles.config.bang = {
			alpha: { start: 1, end: 0, ease: "Sine.easeIn" },
			angle: 0,
			lifespan: 500,
			maxParticles: 1
		};

		this.particles.confetti = this.add.particles("confetti");
		this.particles.config.confetti = {
			frame: {
				frames: [0, 1, 2, 3],
				cycle: true,
				quantity: 2
			},
			gravityY: 200,
			speed: 50,
			angle: { min: 0, max: 360, ease: "Linear" },
			lifespan: 1000,
			rotate: { ease: "Linear", min: 0, max: 360 },
			maxParticles: 8
		};

		this.particles.jump = this.add.particles("jump-effect");
		this.particles.config.jump = {
			frame: 0,
			lifespan: 350,
			maxParticles: 1,
			particleClass: animParticles(this.anims.get("jump-effect"), 7)
		};
	}

	createSounds() {
		this.sfx.bang = this.sound.add("bang");
	}
}
