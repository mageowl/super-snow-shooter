import UpdatedScene from "../../template/scenes/UpdatedScene.js";
import { hostGame, isConnected, joinGame, setName } from "../../../io.js";
import { ERROR } from "../../../../errorCodes.mjs";

export default class HostMenu extends UpdatedScene {
	frame = 0;

	/** @type {Phaser.GameObjects.BitmapText} */
	inputText = null;
	/** @type {Phaser.GameObjects.BitmapText} */
	inputTitle = null;
	name = "";
	canType = true;
	nxtButton = null;
	characterSelect = null;

	create() {
		this.name = "";

		this.add.image(0, 0, "background-host").setOrigin(0).setDepth(-1);

		const buttonContainer = this.add.container(0, 392);
		this.nxtButton = this.addButton("NEXT", 0, buttonContainer).on(
			"pointerdown",
			() => {
				if (this.name.length > 0) {
					this.state = "character-select";
					this.inputTitle.setText("Select a skin:");
					this.inputText.setVisible(false);
					this.nxtButton.parentContainer.setVisible(false);
					this.characterSelect.setVisible(true);
					// hostGame().then(() => {
					// 	setName(this.name);
					// 	this.scene.start("GameScene");
					// });
				}
			}
		);
		this.addButton("BACK", 1, buttonContainer, 0xe43b44, true).on(
			"pointerdown",
			() => this.scene.start("MainMenu")
		);

		this.inputText = this.add
			.bitmapText(380, 264, "zepto", "", 64)
			.setOrigin(0, 1)
			.setDropShadow(2, 2, 0x222222);

		this.inputTitle = this.add
			.bitmapText(380, 200, "zepto-small", "Enter nickname:", 16)
			.setOrigin(0, 1)
			.setDropShadow(1, 1, 0x222222);

		this.input
			.setDefaultCursor("url(assets/sprites/menu/pointer.png), default")
			.keyboard.on("keydown", (e) => {
				if (this.canType) {
					if (e.key === "Backspace") {
						this.name = this.name.slice(0, -1);
					} else if (
						!e.metaKey &&
						!e.ctrlKey &&
						!e.altKey &&
						e.key.length === 1 &&
						this.name.length < 10
					) {
						this.name += e.key;
					}

					this.inputText.setText(this.name);
				}
			});

		const character1 = this.add
			.sprite(0, 0, "player1")
			.setScale(6)
			.setOrigin(0, 0.5)
			.setInteractive()
			.on("pointerover", () => {
				character1.play({ key: "player1.walk", repeat: -1 });
			})
			.on("pointerout", () => {
				character1.stop().setFrame(0);
			})
			.on("pointerdown", () => {
				hostGame().then(() => {
					setName(this.name);
					this.scene.start("GameScene", { textureID: 1 });
				});
			});

		const character2 = this.add
			.sprite(112, 0, "player2")
			.setScale(6)
			.setOrigin(0, 0.5)
			.setInteractive()
			.on("pointerover", () => {
				character2.play({ key: "player2.walk", repeat: -1 });
			})
			.on("pointerout", () => {
				character2.stop().setFrame(0);
			})
			.on("pointerdown", () => {
				hostGame().then(() => {
					setName(this.name);
					this.scene.start("GameScene", { textureID: 2 });
				});
			});

		this.characterSelect = this.add
			.container(380, 264, [character1, character2])
			.setVisible(false);
	}

	update() {}

	addButton(text, index, container, color = 0xffffff, back = false) {
		const y = index * 64;

		const selector = this.add
			.image(340, 5, "button-selector")
			.setScale(3)
			.setVisible(false)
			.setDepth(1)
			.setFlipX(back);
		const bg = this.add
			.image(0, -18, "button")
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
		const label = this.add
			.bitmapText(380, 0, "zepto", text, 32)
			.setOrigin(0, 0.5)
			.setDropShadow(2, 2, 0x555555);

		const btn = this.add.container(0, y, [bg, label, selector]);

		container.add(btn);

		return bg;
	}
}
