import GameScene from "./classes/scene/GameScene.js";

const game = new Phaser.Game({
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.RESIZE
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 200 }
		}
	},
	render: {
		pixelArt: true,
		antialias: false
	},
	loader: {
		baseURL: "assets"
	},
	scene: GameScene
});
