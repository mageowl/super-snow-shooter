import Menu from "../../template/scenes/Menu.js";

export default class EverestMenu extends Menu {
	create() {
		const browser = this.add
			.image(0, 0, "browser-bar")
			.setScale(3)
			.setOrigin(0)
			.setDepth(1)
			.setScrollFactor(0)
			.setInteractive({
				cursor: "url(assets/sprites/menu/pointer_select.png), pointer"
			})
			.on("pointerdown", () => {
				this.scene.start("MainMenu");
			})
			.on("pointerover", () => {
				browser.setTexture("browser-bar.close");
			})
			.on("pointerout", () => {
				browser.setTexture("browser-bar");
			});
		const mountainBg = this.add
			.image(0, 0, "background-sky")
			.setScale(3)
			.setOrigin(0)
			.setTint(0xaaaaaa);
	}
}
