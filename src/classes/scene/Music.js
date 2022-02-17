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
				this.pause();
			});
		this.add.bitmapText(64, 480, "zepto-name-tag", "Music by Bananax", 24);
	}

	pause() {
		this.paused = !this.paused;
		if (this.paused) this.tracks[this.currentlyPlaying].stop();
		else this.tracks[this.currentlyPlaying].play({ loop: true, volume: 0.5 });
	}
}