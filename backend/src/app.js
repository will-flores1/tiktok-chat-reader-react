const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { WebcastPushConnection } = require("tiktok-live-connector");
const {
	TikTokConnectionWrapper,
} = require("./components/TikTokConnectionWrapper.js");
const {
	getGlobalConnectionCount,
} = require("./components/TikTokConnectionWrapper.js");

const app = express();
const server = http.createServer(app);
const PORT = 3000;

/*
 * New socket.io instance
 */
const io = new Server(server, {
	cors: {
		origin: "*",
		allowedHeaders: ["my-custom-header"],
		credentials: true,
	},
	autoConnect: false,
});

/**
 * Listen for new socket.io connections
 */
io.on("connection", (socket) => {
	let TikTokLive;

	socket.on("set-username", (username) => {
		/*
		 * Connect to the Tiktok live stream
		 */
		try {
			TikTokLive = TikTokConnectionWrapper(username);
			TikTokLive.connect();
		} catch (err) {
			console.error("Failed to connect", err);
			return;
		}

		// wait for connection to be established
		TikTokLive.once("connected", () => {
			socket.emit("tiktokConnected", { username });
		});

		/*
		 * Define events to listen for from TikTok
		 */
		TikTokLive.connection.on("chat", (data) => chatFunc(data));
		TikTokLive.connection.on("gift", (data) => giftFunc(data));
		TikTokLive.connection.on("gift", (data) => socket.emit("gift", data));
		TikTokLive.connection.on("roomUser", (data) =>
			socket.emit("roomUser", data)
		);
		TikTokLive.connection.on("like", (data) => socket.emit("like", data));

		/*
		 * Define functions to run when events are received
		 */
		function chatFunc(data) {
			console.log(`\x1b[36m${data.nickname}\x1b[0m: ${data.comment}`);
			socket.emit("chat", data);
		}
		function giftFunc(data) {
			console.log(`\x1b[31m${data.nickname}\x1b[0m: ${data.giftName}`);
			socket.emit("gift", data);
		}
	});

	socket.on("disconnect", () => {
		if (TikTokLive) TikTokLive.disconnect();
	});
});

/*
 * Emit global connection statistics
 */
// setInterval(() => {
// 	io.emit("statistic", { globalConnectionCount: getGlobalConnectionCount() });
// }, 5000);

server.listen(PORT, () => {
	console.info(`Server running! Please visit http://localhost:${PORT}`);
});
