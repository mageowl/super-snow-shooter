import GameScene from "./classes/scene/GameScene.js";
import HUD from "./classes/scene/HUD.js";
import Load from "./classes/scene/Load.js";
import HostMenu from "./classes/scene/menu/HostMenu.js";
import JoinMenu from "./classes/scene/menu/JoinMenu.js";
import MainMenu from "./classes/scene/menu/MainMenu.js";
import { connect } from "./io.js";

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
			// debug: true,
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
	scene: [Load, MainMenu, JoinMenu, HostMenu, GameScene, HUD]
});

connect();
