import UpdatedScene from "../template/scenes/UpdatedScene.js";
import { currentGame } from "../../io.js";

export default class HUD extends UpdatedScene {
	create() {
		const gameCode = this.add
			.bitmapText(
				480,
				50,
				"zepto-name-tag",
				currentGame != null ? currentGame.toUpperCase() : "SOLO Game",
				24
			)
			.setOrigin(0.5);
	}
}
