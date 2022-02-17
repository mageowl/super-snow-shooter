import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class Music extends UpdatedScene {
	/** @type {Phaser.Sound.BaseSound[]} */
	tracks = [];
	currentlyPlaying = 0;
	paused = false;

	create() {
		this.tracks = [this.sound.add("music.bananax.1")];
		this.tracks[this.currentlyPlaying].play({ loop: true, volume: 0.5 });
		console.log("hmmm");
	}
}
