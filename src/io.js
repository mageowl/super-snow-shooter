import { ERROR } from "../errorCodes.mjs";

// get server
const server =
	location.hostname === "mageowls.com"
		? "https://super-snow-shooter.herokuapp.com"
		: "http://localhost:3000";

let lastPacket = null;
let socket = null;
let joinCallbacks = [];
let hostCallbacks = [];
let deathCallbacks = [];
let hitCallbacks = [];

export let currentGame = null;

export default function sendPacket(data) {
	if (socket != null) {
		socket.emit("packet.client", data);
		return lastPacket;
	} else {
		return ERROR.NOT_CONNECTED;
	}
}

export function getPlayerID() {
	if (socket != null) {
		return socket.id;
	} else {
		return ERROR.NOT_CONNECTED;
	}
}

export function hitPlayer(playerID) {
	if (socket != null) {
		socket.emit("hit-player", playerID);
		hitCallbacks.forEach((cb) => cb());
	} else {
		return ERROR.NOT_CONNECTED;
	}
}

export async function connect() {
	const scriptEl = document.createElement("script");
	scriptEl.src = `${server}/socket.io/socket.io.js`;
	document.body.append(scriptEl);

	await new Promise((resolve) => {
		scriptEl.addEventListener("load", () => {
			resolve();
		});
	});

	socket = io(server);

	socket.on("packet.server", (data) => {
		lastPacket = data;
	});

	socket.on("game-created", (id) => {
		hostCallbacks.forEach(({ resolve }) => resolve());
		hostCallbacks = [];
		currentGame = id;
	});

	socket.on("join.resolve", (data) => {
		lastPacket = data;
		joinCallbacks.forEach(({ resolve }) => resolve());
		joinCallbacks = [];
	});

	socket.on("join.err", (code) => {
		joinCallbacks.forEach(({ reject }) => reject(code));
		joinCallbacks = [];
		currentGame = null;
	});

	socket.on("die", () => {
		// open("about:blank", "_self").close();
		deathCallbacks.forEach((callback) => callback());
	});
}

export function isConnected() {
	return socket != null;
}

export function joinGame(code) {
	if (socket != null) {
		socket.emit("join-game", code);
		currentGame = code;

		return new Promise((resolve, reject) => {
			joinCallbacks.push({ resolve, reject });
		});
	} else {
		return Promise.reject(ERROR.NOT_CONNECTED);
	}
}

export function setName(name) {
	if (socket != null) {
		socket.emit("set-name", name);
	} else {
		return ERROR.NOT_CONNECTED;
	}
}

export function hostGame() {
	if (socket != null) {
		socket.emit("host-game", {});

		return new Promise((resolve, reject) => {
			hostCallbacks.push({ resolve, reject });
		});
	} else {
		return Promise.reject(ERROR.NOT_CONNECTED);
	}
}

export function onDeath(callback) {
	deathCallbacks.push(callback);
}

export function onKill(callback) {
	hitCallbacks.push(callback);
}
