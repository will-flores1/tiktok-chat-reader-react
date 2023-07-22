const { WebcastPushConnection } = require("tiktok-live-connector");
const { EventEmitter } = require("events");

let globalConnectionCount = 0;

const TikTokConnectionWrapper = (uniqueId, options, enableLog) => {
	// Private properties and functions (if needed)
	let clientDisconnected = false;
	let reconnectEnabled = true;
	let reconnectCount = 0;
	let reconnectWaitMs = 1000;
	const maxReconnectAttempts = 5;

	const connection = new WebcastPushConnection(uniqueId, options);

	connection.on("streamEnd", () => {
		log(`streamEnd event received, giving up connection`);
		reconnectEnabled = false;
	});

	connection.on("disconnected", () => {
		globalConnectionCount -= 1;
		log(`TikTok connection disconnected`);
		scheduleReconnect();
	});

	connection.on("error", (err) => {
		log(`Error event triggered: ${err.info}, ${err.exception}`);
		console.error(err);
	});

	// Public properties and functions
	const instance = {
		uniqueId,
		enableLog,
		connection,
		connect,
		scheduleReconnect,
		disconnect,
		log,
	};

	function connect(isReconnect) {
		connection
			.connect()
			.then((state) => {
				log(
					`${isReconnect ? "Reconnected" : "Connected"} to roomId ${
						state.roomId
					}, websocket: ${state.upgradedToWebsocket}`
				);

				globalConnectionCount += 1;

				// Reset reconnect vars
				reconnectCount = 0;
				reconnectWaitMs = 1000;

				// Client disconnected while establishing connection => drop connection
				if (clientDisconnected) {
					connection.disconnect();
					return;
				}

				// Notify client
				if (!isReconnect) {
					instance.emit("connected", state);
				}
			})
			.catch((err) => {
				log(`${isReconnect ? "Reconnect" : "Connection"} failed, ${err}`);

				if (isReconnect) {
					// Schedule the next reconnect attempt
					scheduleReconnect(err);
				} else {
					// Notify client
					instance.emit("disconnected", err.toString());
				}
			});
	}

	function scheduleReconnect(reason) {
		if (!reconnectEnabled) {
			return;
		}

		if (reconnectCount >= maxReconnectAttempts) {
			log(`Give up connection, max reconnect attempts exceeded`);
			instance.emit("disconnected", `Connection lost. ${reason}`);
			return;
		}

		log(`Try reconnect in ${reconnectWaitMs}ms`);

		setTimeout(() => {
			if (!reconnectEnabled || reconnectCount >= maxReconnectAttempts) {
				return;
			}

			reconnectCount += 1;
			reconnectWaitMs *= 2;
			connect(true);
		}, reconnectWaitMs);
	}

	function disconnect() {
		log(`Client connection disconnected`);

		clientDisconnected = true;
		reconnectEnabled = false;

		if (connection.getState().isConnected) {
			// Disconnect from TikTok
			connection.disconnect();
		}
	}

	function log(logString) {
		if (enableLog) {
			console.log(`WRAPPER @${uniqueId}: ${logString}`);
		}
	}

	// Attach EventEmitter methods (if required)
	Object.setPrototypeOf(instance, EventEmitter.prototype);
	EventEmitter.call(instance);

	return instance;
};

module.exports = {
	TikTokConnectionWrapper,
	getGlobalConnectionCount: () => globalConnectionCount,
};
