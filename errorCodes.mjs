function error(name, code) {
	return `ERR Code ${code}: ${name}`;
}

export const ERROR = {
	GAME_NOT_FOUND: error("game-not-found", 0),
	NOT_CONNECTED: error("not-connected", 1)
};
