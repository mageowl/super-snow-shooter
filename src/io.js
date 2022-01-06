// get server
const server =
	location.hostname === "seattleowl.com"
		? "https://super-snow-shooter.herokuapp.com"
		: "http://localhost:3000";

let lastPacket = null;
let socket = null;
let left = [];
let joinCallbacks = [];
let hostCallbacks = [];

export default function sendPacket(data) {
	socket.emit("packet.client", data);
	return lastPacket;
}

export function getPlayerID() {
	return socket.id;
}

export function getRemovedPlayers() {
	const data = left;
	if (left.length) console.log("DESTRUCTION!");
	left = [];
	return data;
}

export function hitPlayer(playerID) {
	socket.emit("hit-player", playerID);
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
		alert("Game ID: " + id);
		hostCallbacks.forEach(({ resolve }) => resolve());
		hostCallbacks = [];
	});

	socket.on("join.resolve", (data) => {
		lastPacket = data;
		alert("Connected to game.");
		joinCallbacks.forEach(({ resolve }) => resolve());
		joinCallbacks = [];
	});

	socket.on("join.err", (code) => {
		joinCallbacks.forEach(({ reject }) => reject(code));
		joinCallbacks = [];
	});

	socket.on("die", () => {
		console.log("u ded");
		open("about:blank", "_self").close();
	});

	socket.on("player-leave", (id) => {
		left.push(id);
		console.log("someone go byebye");
	});
}

export function joinGame(code) {
	socket.emit("join-game", code);

	return new Promise((resolve, reject) => {
		joinCallbacks.push({ resolve, reject });
	});
}

export function setName(name) {
	socket.emit("set-name", name);
}

export function hostGame() {
	socket.emit("host-game", {});

	return new Promise((resolve, reject) => {
		hostCallbacks.push({ resolve, reject });
	});
}
