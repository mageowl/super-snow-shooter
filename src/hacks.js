let hacks = false;

if (!location.hostname.endsWith("mageowlstudios.com")) {
	globalThis.hack = function () {
		hacks = true;
	};
}

export default () => hacks;
