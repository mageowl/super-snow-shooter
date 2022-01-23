import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class Load extends UpdatedScene {
	preload() {
		// PLAYER
		this.load.aseprite(
			"player1",
			"sprites/player/player1.png",
			"sprites/player/player1.json"
		);

		this.load.aseprite(
			"player2",
			"sprites/player/player2.png",
			"sprites/player/player2.json"
		);

		this.load.image("snowball", "sprites/player/snowball.png");

		// TILEMAP
		this.load.image("snow", "sprites/tileset/ground.png");
		this.load.image("ice", "sprites/tileset/ice.png");
		this.load.image("background-tileset", "sprites/tileset/background.png");
		this.load.image("bridge", "sprites/tileset/bridge.png");
		this.load.image("snowfort", "sprites/tileset/snowfort.png");

		this.load.tilemapTiledJSON("map", "tilemap/icy_peaks.json");

		// BACKGROUND
		this.load.image("background-sky", "sprites/background/sky.png");
		this.load.image("background-main", "sprites/background/menu-1.png");
		this.load.image("background-join", "sprites/background/menu-2.png");
		this.load.image("background-host", "sprites/background/menu-3.png");

		// FONTS
		this.load.bitmapFont(
			"zepto-name-tag",
			"font/zepto-name-tag.png",
			"font/zepto-name-tag.xml"
		);
		this.load.bitmapFont("zepto", "font/zepto.png", "font/zepto.xml");
		this.load.bitmapFont(
			"zepto-small",
			"font/zepto-small.png",
			"font/zepto-small.xml"
		);
		this.load.bitmapFont(
			"zepto-red-small",
			"font/zepto-red-small.png",
			"font/zepto-red-small.xml"
		);

		// GUI
		this.load.image("button", "sprites/menu/button.png");
		this.load.image("button-selector", "sprites/menu/selector.png");
		this.load.image("title", "sprites/menu/title.png");
		this.load.image("server-down", "sprites/menu/server-down.png");
		this.load.aseprite(
			"killstreak",
			"sprites/hud/killstreak.png",
			"sprites/hud/killstreak.json"
		);
		this.load.image(
			"powerUp.jump-boost",
			"sprites/hud/power-ups/jump-boost.png"
		);
		this.load.image("powerUp.speed", "sprites/hud/power-ups/speed.png");
	}

	create() {
		this.createAnimations();

		this.scene.start("MainMenu");
	}

	createAnimations() {
		this.anims.createFromAseprite("player1");
		this.anims.createFromAseprite("player2");
		this.anims.createFromAseprite("killstreak");
	}
}
