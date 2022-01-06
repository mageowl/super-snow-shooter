import UpdatedScene from "../../template/scenes/UpdatedScene.js";
import { connect, joinGame } from "../../../io.js";

export default class JoinMenu extends UpdatedScene {
	frame = 0;

	/** @type {Phaser.GameObjects.BitmapText} */
	inputText = null;
	/** @type {Phaser.GameObjects.BitmapText} */
	inputTitle = null;
	code = "";
	canType = true;

	create() {
		this.code = "";

		this.add.image(0, 0, "background-join").setOrigin(0).setDepth(-1);

		const buttonContainer = this.add.container(0, 392);
		this.addButton("NEXT", 0, buttonContainer).on("pointerdown", () => {
			if (this.code.length === 4) {
				this.canType = false;
				joinGame(this.code)
					.then(() => {
						this.scene.start("GameScene");
					})
					.catch((code) => {
						this.inputTitle
							.setText("Game not found.")
							.setFont("zepto-red-small", 16)
							.setDropShadow(1, 1, 0x9e2835);
						setTimeout(() => {
							this.code = "";
							this.canType = true;
							this.inputText.setText("____");
							this.inputTitle
								.setText("Enter game ID:")
								.setFont("zepto-small", 16)
								.setDropShadow(1, 1, 0x222222);
						}, 500);
					});
			}
		});
		this.addButton("BACK", 1, buttonContainer, 0xe43b44, true).on(
			"pointerdown",
			() => this.scene.start("MainMenu")
		);

		this.inputText = this.add
			.bitmapText(380, 264, "zepto", "____", 64)
			.setOrigin(0, 1)
			.setDropShadow(2, 2, 0x222222);

		this.inputTitle = this.add
			.bitmapText(380, 200, "zepto-small", "Enter game ID:", 16)
			.setOrigin(0, 1)
			.setDropShadow(1, 1, 0x222222);

		this.input
			.setDefaultCursor("url(assets/sprites/menu/pointer.png), default")
			.keyboard.on("keydown", (e) => {
				if (this.canType) {
					if (e.key === "Backspace") {
						this.code = this.code.slice(0, -1);
					} else if (
						!e.metaKey &&
						!e.ctrlKey &&
						!e.altKey &&
						e.key.length === 1 &&
						this.code.length < 4
					) {
						this.code += e.key.toLowerCase();
					}

					this.inputText.setText(this.code.padEnd(4, "_").toUpperCase());
				}
			});
	}

	update() {}

	addButton(text, index, container, color = 0xffffff, back = false) {
		const y = index * 64;

		const selector = this.add
			.image(340, y + 5, "button-selector")
			.setScale(3)
			.setVisible(false)
			.setDepth(1)
			.setFlipX(back);
		const bg = this.add
			.image(0, y - 18, "button")
			.setTint(color)
			.setOrigin(0, 0)
			.setAlpha(0.1)
			.setInteractive({
				cursor: "url(assets/sprites/menu/pointer_select.png), pointer"
			})
			.on("pointerover", () => {
				bg.setAlpha(1);
				selector.setVisible(true);
			})
			.on("pointerout", () => {
				bg.setAlpha(0.1);
				selector.setVisible(false);
			});
		const btn = this.add
			.bitmapText(380, y, "zepto", text, 32)
			.setOrigin(0, 0.5)
			.setDropShadow(2, 2, 0x555555);

		container.add([bg, btn, selector]);

		return bg;
	}
}
