import { socket } from "../socket.js";

export function ConnectionManager() {
	function connectSocket() {
		try {
			socket.connect();
			console.log("Connected to socket");
		} catch (error) {
			console.log("Error connecting to socket", error);
		}
	}

	function disconnectSocket() {
		try {
			console.log("Disconnected from socket");
			socket.disconnect();
		} catch (error) {
			console.log("Error disconnecting from socket", error);
		}
	}

	return (
		<>
			<button onClick={connectSocket}>Connect</button>
			<button onClick={disconnectSocket}>Disconnect</button>
		</>
	);
}
