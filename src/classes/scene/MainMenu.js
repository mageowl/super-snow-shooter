import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class MainMenu extends UpdatedScene {
	preload() {
		this.load.image("title", "sprites/other/title.png");
	}

	create() {
		this.add.image(480, 100, "title").setScale(3);

		// connect(SERVER).then(() => {
		// })w
	}
}
