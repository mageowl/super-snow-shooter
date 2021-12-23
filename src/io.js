let lastPacket = null;
let socket = null;

export default function sendPacket(data) {
	socket.emit("packet.client", data);
	return lastPacket;
}

export function getPlayerID() {
	return socket.id;
}

export async function connect(url) {
	const scriptEl = document.createElement("script");
	scriptEl.src = `${url}/socket.io/socket.io.js`;
	document.body.append(scriptEl);

	await new Promise((resolve) => {
		scriptEl.addEventListener("load", () => {
			resolve();
		});
	});

	socket = io(url);

	if (confirm("Make new game?")) {
		socket.emit("host-game", {}, prompt("Name?"));
	} else {
		socket.emit("join-game", prompt("Game ID?"), prompt("Name?"));
	}

	socket.on("packet.server", (data) => {
		lastPacket = data;
		console.log("new data");
	});

	socket.on("game-created", (id) => {
		alert("Game ID: " + id);
	});

	socket.on("packet.join", (data) => {
		lastPacket = data;
		alert("Connected to game.");
	});
}
