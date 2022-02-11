class AnimatedParticle extends Phaser.GameObjects.Particles.Particle {
	constructor(animation, frameCount, emitter) {
		super(emitter);
		this.t = 0;
		this.i = 0;
		this.anim = animation;
		this.frameCount = frameCount;
	}

	update(delta, step, processors) {
		const result = super.update(delta, step, processors);
		this.t += delta;
		if (this.t >= this.anim.msPerFrame) {
			this.i += 1;
			if (this.i > this.frameCount) {
				this.i = 0;
			}
			this.frame = this.anim.frames[this.i]?.frame ?? 0;
			this.t -= this.anim.msPerFrame;
		}
		return result;
	}
}

export default function animParticles(animation, frameCount) {
	return AnimatedParticle.bind(null, animation, frameCount);
}
