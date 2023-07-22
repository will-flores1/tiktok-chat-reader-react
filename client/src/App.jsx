import { useState, useEffect } from "react";
import { socket } from "./socket.js";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { MyForm } from "./components/MyForm";
import { Chat } from "./components/Chat.jsx";

export default function App() {
	const [isConnected, setIsConnected] = useState(false);
	const [chatMessages, setChatMessages] = useState([]);
	// const [gifts, setGifts] = useState([]);

	function addChatMessage(data) {
		setChatMessages((previous) => [...previous, data]);
	}

	useEffect(() => {
		socket.on("connect", () => setIsConnected(true));
		socket.on("disconnect", () => setIsConnected(false));
		socket.on("chat", (data) => addChatMessage(data));
		//TODO:
		// socket.on("gift", (data) => {
		// 	setGifts((previous) => [
		// 		...previous,
		// 		{ gift: data.giftName, nickname: data.nickname },
		// 	]);
		// });

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("chat");
		};
	}, []);

	return (
		<div className="App">
			<ConnectionState isConnected={isConnected} />
			<ConnectionManager />
			<MyForm />
			<Chat chatMessages={chatMessages} />
		</div>
	);
}
