export default class UpdatedScene extends Phaser.Scene {
	#updateList = [];

	updateObj(object) {
		this.#updateList.push(object);
	}
	removeUpdate(object) {
		this.#updateList.splice(this.#updateList.indexOf(object), 1);
	}

	constructor() {
		super(new.target.name);
	}

	createClickEvents() {
		this.input.addListener("gameobjectdown", (p, obj) => obj.click(p));
	}

	update() {
		this.#updateList.forEach((o) => o.update());
	}
}
