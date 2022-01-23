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
		this.data.reduce((prev, current) => {
			if (typeof prev === "string" && typeof current === "number") {
				PowerUp.#modifiers[prev] = current;
				return null;
			} else if (typeof prev === "string" && typeof current === "string") {
				PowerUp.#flags.push(prev);
				return current;
			} else return current;
		});
	}
}
