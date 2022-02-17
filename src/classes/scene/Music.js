import UpdatedScene from "../template/scenes/UpdatedScene.js";

export default class Music extends UpdatedScene {
	/** @type {Phaser.Sound.BaseSound[]} */
	tracks = [];
	currentlyPlaying = 0;
	paused = false;

	create() {
		this.tracks = [this.sound.add("music.bananax.1")];
		this.tracks[this.currentlyPlaying].play({ loop: true, volume: 0.5 });

		const disc = this.add
			.image(10, 480, "disc.bananax")
			.setOrigin(0)
			.setScale(3)
			.setInteractive()
			.on("pointerover", () => {
				disc.setTexture("disc.bananax.open");
			})
			.on("pointerout", () => {
				disc.setTexture("disc.bananax");
			})
			.on("pointerdown", () => {
				// this.next();
			});
		this.add.bitmapText(64, 480, "zepto-name-tag", "Music by Bananax", 24);
		this.add.bitmapText(64, 504, "zepto-small", "M to pause", 16);

		this.input.keyboard.on("keydown-M", () => this.pause());
	}

	pause() {
		this.paused = !this.paused;
		if (this.paused) this.tracks[this.currentlyPlaying].pause();
		else this.tracks[this.currentlyPlaying].resume();
	}

	next() {
		this.tracks[this.currentlyPlaying].stop();
		this.currentlyPlaying = (this.currentlyPlaying + 1) % this.tracks.length;
		this.tracks[this.currentlyPlaying].play({ loop: true, volume: 0.5 });
	}
}
