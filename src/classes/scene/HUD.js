import UpdatedScene from "../template/scenes/UpdatedScene.js";
import { currentGame, onDeath, onKill } from "../../io.js";

export default class HUD extends UpdatedScene {
	killstreak = 0;
	killBar = null;

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

		this.killBar = this.add
			.sprite(25, 25, "killstreak")
			.setScale(3)
			.setOrigin(0, 0.5);

		onDeath(() => {
			this.killstreak = 0;
			this.killBar.setFrame(0);
		});
		onKill(() => {
			this.killstreak++;
			this.killBar.play(`streak.${this.killstreak}`);
			if (this.killstreak === 3) {
				this.killBar.on("animationfinish", () => {
					// Get a power-up
				});
			}
		});
	}
}
