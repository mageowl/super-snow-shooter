import UpdatedScene from "./UpdatedScene.js";

export const BUTTON = { NORMAL: 0, BACK: -1, NEXT: 1, DISABLED: -2 };

export default class Menu extends UpdatedScene {
	addButton(text, index, container, type = BUTTON.NORMAL, color = 0xffffff) {
		const y = index * 64;

		const selector = this.add
			.image(340, 5, "button-selector")
			.setScale(3)
			.setVisible(false)
			.setDepth(1)
			.setFlipX(type === BUTTON.BACK);
		const bg = this.add
			.image(0, -18, "button")
			.setTint(color)
			.setOrigin(0, 0)
			.setAlpha(0.1);
		const label = this.add
			.bitmapText(380, 0, "zepto", text, 32)
			.setOrigin(0, 0.5)
			.setDropShadow(2, 2, 0x555555);

		if (type !== BUTTON.DISABLED) {
			bg.setInteractive({
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
		} else label.setAlpha(0.5);

		const btn = this.add.container(0, y, [bg, label, selector]);

		container.add(btn);

		if (type === BUTTON.NEXT) {
			this.input.keyboard.on("keydown-ENTER", () => {
				bg.emit("pointerdown");
			});
		}

		return bg;
	}
}
