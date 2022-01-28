import Player from "./Player.js";

export default class PowerUp {
	static #modifiers = {};
	static #flags = [];

	static reset() {
		this.#modifiers = {};
		this.#flags = [];
	}

	static getStat(key) {
		return this.#modifiers[key] ?? Player[key];
	}
	static getFlag(flag) {
		return this.#flags.includes(flag);
	}

	constructor(name, ...data) {
		this.name = name;
		this.data = data;
	}

	apply() {
		let prev = null;
		this.data.forEach((current) => {
			console.log(typeof prev, typeof current);
			if (typeof prev === "string" && typeof current === "number") {
				PowerUp.#modifiers[prev] = current;
				console.log();
			} else if (typeof prev === "string" && typeof current === "string") {
				PowerUp.#flags.push(prev);
			} else if (typeof current === "string" && prev == null) {
				PowerUp.#flags.push(current);
			}

			prev = current;
		});
	}
}
