import UpdatedScene from "../template/scenes/UpdatedScene.js";
import { currentGame, onDeath, onKill } from "../../io.js";
import PowerUp from "../objects/PowerUp.js";

const powerUps = [
	new PowerUp("jump-boost", "JUMP_HEIGHT", 300),
	new PowerUp("speed", "SPEED", 250)
];

export default class HUD extends UpdatedScene {
	killstreak = 0;
	killBar = null;
	activePowerUp = null;

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
		this.activePowerUp = this.add
			.sprite(25, 50, "powerUp.jumpBoost")
			.setVisible(false)
			.setScale(3)
			.setOrigin(0);

		onDeath(() => {
			this.killstreak = 0;
			this.killBar.setFrame(0);
			PowerUp.reset();
			this.activePowerUp.setVisible(false);
		});
		onKill(() => {
			if (this.killstreak !== 3) {
				this.killstreak++;
				this.killBar.play(`streak.${this.killstreak}`);
				if (this.killstreak === 3) {
					this.killBar.on("animationcomplete", () => {
						const powerUp =
							powerUps[Math.floor(Math.random() * powerUps.length)];
						powerUp.apply();
						this.activePowerUp
							.setTexture(`powerUp.${powerUp.name}`)
							.setVisible(true);
					});
				}
			}
		});
	}
}
