import { isConnected } from "../../../io.js";
import Menu, { BUTTON } from "../../template/scenes/Menu.js";
import Music from "../Music.js";

export default class MainMenu extends Menu {
	frame = 0;

	/** @type {Phaser.GameObjects.Container} */
	title = null;
	serverWarning = null;
	buttons = {
		container: null,
		play: null,
		randomGame: null,
		host: null
	};

	create() {
		this.title = this.add.container(480, 100, [
			this.add.image(5, 5, "title").setScale(3).setTint(0x000000),
			this.add.image(0, 0, "title").setScale(3)
		]);

		this.add.image(0, 0, "background-main").setOrigin(0).setDepth(-1);

		if (!isConnected())
			this.serverWarning = this.add
				.image(281, 475, "server-down")
				.setOrigin(0, 0.5)
				.setScale(3);

		const buttonContainer = this.add.container(0, 264);
		this.addButton("PLAY", 0, buttonContainer, BUTTON.NORMAL, 0x63c74d).on(
			"pointerdown",
			() => this.scene.start("JoinMenu")
		);
		this.addButton("EVEREST", 2, buttonContainer, BUTTON.DISABLED);
		// .on(
		// 	"pointerdown",
		// 	() => {
		// 		this.scene.start("EverestMenu")
		// 	}
		// );
		this.addButton("HOST GAME", 1, buttonContainer).on("pointerdown", () => {
			if (isConnected()) this.scene.start("HostMenu");
		});

		const disc = this.add
			.image(10, 480, "disc.bananax")
			.setOrigin(0)
			.setScale(3)
			.setInteractive()
			.on("pointerover", () => {
				disc.setTexture("disc.bananax.open");
			})
			.on("pointerout", () => {
				disc.setTexture("disc.bananax");
			});
		this.add.bitmapText(64, 480, "zepto-name-tag", "Music by Bananax", 24);

		this.input.setDefaultCursor(
			"url(assets/sprites/menu/pointer.png), default"
		);
	}

	update() {
		this.frame = (this.frame + 1) % 180;
		this.title.setPosition(
			480,
			Math.sin(this.frame * (Math.PI / 180) * 2) * 10 + 100
		);

		if (isConnected() && this.serverWarning) {
			this.serverWarning.destroy();
			this.serverWarning = null;
		}
	}
}
