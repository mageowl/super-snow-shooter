import UpdatedScene from "../template/scenes/UpdatedScene.js";
import { currentGame, onDeath, onKill } from "../../io.js";
import PowerUp from "../objects/PowerUp.js";
import hacks from "../../hacks.js";

const powerUps = [
	new PowerUp("jump-boost", "JUMP_HEIGHT", 300),
	new PowerUp("speed", "SPEED", 180, "CROUCH_SPEED", 100),
	new PowerUp("snow-speed", "FIRE_VELOCITY", 400),
	new PowerUp("santa", "SHOOT_PRESENTS")
];

export default class HUD extends UpdatedScene {
	killstreak = 0;
	killBar = null;
	activePowerUp = null;
	poweredUp = false;

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

		if (currentGame != null)
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
			this.poweredUp = false;
		});
		onKill(() => {
			if (this.killstreak !== 3) {
				this.killstreak++;
				this.killBar.play(`streak.${this.killstreak}`);
				if (this.killstreak === 3) {
					this.killBar.once("animationcomplete", () => {
						const powerUp =
							powerUps[Math.floor(Math.random() * powerUps.length)];
						powerUp.apply();
						this.activePowerUp
							.setTexture(`powerUp.${powerUp.name}`)
							.setVisible(true);
						this.poweredUp = true;
					});
				}
			}
		});

		this.input.keyboard.on("keydown-P", () => {
			if (currentGame == null || hacks()) {
				if (!this.poweredUp) {
					// Solo game
					const powerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
					powerUp.apply();
					this.activePowerUp
						.setTexture(`powerUp.${powerUp.name}`)
						.setVisible(true);
					this.poweredUp = true;
				} else {
					PowerUp.reset();
					this.activePowerUp.setVisible(false);
					this.poweredUp = false;
				}
			}
		});
	}
}
