import UpdatedScene from "../../template/scenes/UpdatedScene.js";
import { connect } from "../../../io.js";

export default class JoinMenu extends UpdatedScene {
	frame = 0;

	/** @type {Phaser.GameObjects.BitmapText} */
	codeInput = null;
	code = "";

	create() {
		this.code = "";

		this.add.image(0, 0, "background-join").setOrigin(0).setDepth(-1);

		const buttonContainer = this.add.container(0, 456);
		this.addButton("BACK", 0, buttonContainer, 0xe43b44, true).on(
			"pointerdown",
			() => this.scene.start("MainMenu")
		);

		this.codeInput = this.add
			.bitmapText(380, 264, "zepto", "____", 64)
			.setOrigin(0, 1)
			.setDropShadow(2, 2, 0x222222);

		this.input
			.setDefaultCursor("url(assets/sprites/menu/pointer.png), default")
			.keyboard.on("keydown", (e) => {
				if (e.key === "Backspace") {
					this.code = this.code.slice(0, -1);
				} else if (
					!e.metaKey &&
					!e.ctrlKey &&
					!e.altKey &&
					e.key.length === 1
				) {
					this.code += e.key.toLowerCase();
				}

				this.codeInput.setText(this.code.padEnd(4, "_").toUpperCase());

				if (this.code.length === 4) {
					connect({ join: true, name: prompt("Name?"), data: this.code }).then(
						() => {
							this.scene.start("GameScene");
						}
					);
					this.code = "";
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
