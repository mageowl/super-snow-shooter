import GameScene from "./classes/scene/GameScene.js";
import { connect } from "./io.js";

// get server
const SERVER =
	location.hostname === "seattleowl.com"
		? "https://super-snow-shooter.herokuapp.com"
		: "http://localhost:3000";

const game = new Phaser.Game({
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		width: 960,
		height: 528,
		autoCenter: true
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 400 }
		}
	},
	render: {
		pixelArt: true
	},
	antialias: false,
	loader: {
		baseURL: "assets"
	},
	scene: GameScene
});

connect(SERVER);
