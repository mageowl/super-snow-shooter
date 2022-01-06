import { connect, hostGame } from "../../../io.js";
import UpdatedScene from "../../template/scenes/UpdatedScene.js";

export default class MainMenu extends UpdatedScene {
	frame = 0;

	/** @type {Phaser.GameObjects.Container} */
	title = null;
	buttons = {
		container: null,
		play: null,
		randomGame: null,
		host: null
	};

	preload() {
		this.load.image("title", "sprites/menu/title.png");
		this.load.image("background-main", "sprites/background/menu-1.png");
		this.load.image("background-join", "sprites/background/menu-2.png");
		this.load.image("button", "sprites/menu/button.png");
		this.load.image("button-selector", "sprites/menu/selector.png");
		this.load.bitmapFont("zepto", "font/zepto.png", "font/zepto.xml");
		this.load.bitmapFont(
			"zepto-small",
			"font/zepto-small.png",
			"font/zepto-small.xml"
		);
		this.load.bitmapFont(
			"zepto-red-small",
			"font/zepto-red-small.png",
			"font/zepto-red-small.xml"
		);
	}

	create() {
		this.title = this.add.container(480, 100, [
			this.add.image(5, 5, "title").setScale(3).setTint(0x000000),
			this.add.image(0, 0, "title").setScale(3)
		]);

		this.add.image(0, 0, "background-main").setOrigin(0).setDepth(-1);

		const buttonContainer = this.add.container(0, 264);
		this.addButton("PLAY", 0, buttonContainer, 0x63c74d).on("pointerdown", () =>
			this.scene.start("JoinMenu")
		);
		this.addButton("JOIN RANDOM GAME", 1, buttonContainer);
		this.addButton("HOST GAME", 2, buttonContainer).on("pointerdown", () => {
			hostGame().then(() => {
				this.scene.start("GameScene");
			});
		});

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
	}

	addButton(text, index, container, color = 0xffffff) {
		const y = index * 64;

		const selector = this.add
			.image(340, y + 5, "button-selector")
			.setScale(3)
			.setVisible(false)
			.setDepth(1);
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
