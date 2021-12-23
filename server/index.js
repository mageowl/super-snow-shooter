import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const PORT = process.env.PORT ?? 3000;
const debug = process.env.DEVELOP === "true";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: debug ? "http://localhost:5500" : "https://seattleowl.com",
		methods: ["GET", "POST"]
	}
});

const games = {};
const gamemode = { TOTEM_STEAL: 0, FREE_FOR_ALL: 0, TEAM_2: 1, TEAM_4: 2 };
function generateID() {
	const id = Math.random().toString(36).substring(2, 6);
	if (games[id] == null) {
		return id;
	} else {
		return generateID();
	}
}

io.on("connection", (socket) => {
	if (debug) console.log("player connected...");
	let currentGame = null;

	socket.on("join-game", (id, name) => {
		if (games?.[id]?.inLobby) {
			games[id].players[socket.id] = {
				name,
				x: 0,
				y: 0,
				snowballs: []
			};
			currentGame = id;

			socket.emit("packet.server", games[id]);
			console.log("Game Joined: ", id);
		}
	});

	socket.on("host-game", (config, name) => {
		const id = generateID();

		currentGame = id;

		games[id] = {
			players: {
				[socket.id]: {
					name,
					x: 0,
					y: 0,
					snowballs: []
				}
			},
			inLobby: true,
			mode: gamemode.TOTEM_STEAL,
			teams: gamemode.FREE_FOR_ALL
		};

		socket.emit("game-created", id);
		console.log("! ", id, " !");
	});

	socket.on("packet.client", (data) => {
		if (currentGame) {
			games[currentGame].players[socket.id] = data;
			socket.emit("packet.server", games[currentGame]);
		}
	});

	socket.on("disconnect", () => {
		if (debug) console.log("player disconnect...");
		if (currentGame) {
			delete games[currentGame].players[socket.id];
		}
	});
});

app.get("/", (req, res) => {
	res.send(
		`<p># SuperSnowballShooterServer ###<br> Version ${
			process.env.VERSION
		}, running NodeJS ${process.version}.<br> ${
			!debug
				? "Go to https://seattleowl.com/super-snow-shooter to play."
				: "<strong>! WARNING !</strong> Debug mode is enabled. The server can currently be accessed from localhost. Please contact owen@seattleowl.com if you are seeing this."
		}</p>`
	);
});

httpServer.listen(PORT, () => {
	console.log("go");
});
