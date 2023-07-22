import { useState, useEffect } from "react";
import { socket } from "./socket.js";
import { ConnectionState } from "./components/ConnectionState";
import { ConnectionManager } from "./components/ConnectionManager";
import { MyForm } from "./components/MyForm";
import { Chat } from "./components/Chat.jsx";
import { Gifts } from "./components/Gifts.jsx";
import { StreamStats } from "./components/StreamStats.jsx";

export default function App() {
	const [isConnected, setIsConnected] = useState(false);
	const [chatMessages, setChatMessages] = useState([]);
	const [gifts, setGifts] = useState([]);
	const [viewerCount, setViewerCount] = useState(0);
	const [likeCount, setLikeCount] = useState(0);
	// const [coinCount, setCoinCount] = useState(0);

	function addChatMessage(data) {
		setChatMessages((previous) => [...previous, data]);
	}
	function isPendingStreak(data) {
		const streakId = data.userId.toString() + "_" + data.giftId;
		return gifts.some((gift) => gift.streakId === streakId);
	}
	function updateGifts(data) {
		const streakId = data.userId.toString() + "_" + data.giftId;
		setGifts((prevGifts) => {
			const updatedGifts = prevGifts.map((gift) => {
				// If the gift is part of a streak, update the repeatCount
				if (gift.streakId === streakId) {
					return { ...gift, repeatCount: data.repeatCount };
				}
				return gift;
			});

			if (isPendingStreak(data)) {
				// If the gift is part of a streak, just update the repeatCount
				return updatedGifts;
			} else {
				// If the gift is not part of a streak, add it to the gifts array
				return [...updatedGifts, { ...data, streakId: streakId }];
			}
		});
	}

	useEffect(() => {
		socket.on("connect", () => setIsConnected(true));
		socket.on("disconnect", () => setIsConnected(false));
		socket.on("chat", (data) => addChatMessage(data));
		socket.on("gift", (data) => {
			if (!isPendingStreak(data) && data.diamondCount > 0) {
				updateGifts(data);
			}
		});
		socket.on("roomUser", (data) => setViewerCount(data.viewerCount));
		socket.on("like", (data) => setLikeCount(data.totalLikeCount));

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("chat");
		};
	}, []);

	const styles = {
		wrapper: {
			display: "flex",
			width: "100%",
		},
	};

	return (
		<div className="App">
			<ConnectionState isConnected={isConnected} />
			<ConnectionManager />
			<MyForm />
			<StreamStats viewerCount={viewerCount} likeCount={likeCount} />
			<div style={styles.wrapper}>
				<Chat chatMessages={chatMessages} />
				<Gifts gifts={gifts} />
			</div>
		</div>
	);
}
