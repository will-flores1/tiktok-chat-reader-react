/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export function Chat({ chatMessages }) {
	const ulRef = useRef(null);
	const [userScrolledUp, setUserScrolledUp] = useState(false);

	// Scroll to the bottom when new messages come in and the user is not scrolling up
	useEffect(() => {
		if (!userScrolledUp && ulRef.current) {
			ulRef.current.scrollTop = ulRef.current.scrollHeight;
		}
	}, [chatMessages, userScrolledUp]);

	// Add a scroll event listener to the <ul> element
	useEffect(() => {
		const ulElement = ulRef.current;

		function handleScroll() {
			// Check if the user is scrolled up
			if (ulElement) {
				const isScrolledUp =
					ulElement.scrollTop + ulElement.clientHeight < ulElement.scrollHeight;
				setUserScrolledUp(isScrolledUp);
			}
		}

		if (ulElement) {
			ulElement.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (ulElement) {
				ulElement.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	function scrollDown() {
		if (ulRef.current) {
			ulRef.current.scrollTop = ulRef.current.scrollHeight;
		}
	}

	const styles = {
		wrapper: {
			display: "flex",
			flexDirection: "column",
			width: "50%",
			justifyContent: "space-between",
			backgroundColor: "hsl(0deg 0% 10%)",
		},
		listStyle: {
			listStyleType: "none",
			overflowY: "scroll",
			overflowX: "hidden",
			height: "calc(100vh - 240px)",
			padding: "0",
			margin: "0",
			lineHeight: "2",
		},
		listItem: {
			display: "flex",
			alignItems: "center",
		},
		profilePicture: {
			height: "18px",
			width: "18px",
			borderRadius: "50%",
			marginRight: "5px",
		},
	};

	return (
		<div style={styles.wrapper}>
			<h2>Chat</h2>
			<ul ref={ulRef} style={styles.listStyle}>
				{chatMessages.map((event, index) => (
					<li key={index} style={styles.listItem}>
						<img
							style={styles.profilePicture}
							height={24}
							width={24}
							src={event.profilePictureUrl}
							alt={`${event.nickname} profile picture`}
						/>
						<span style={{ color: "#36a2eb" }}>{`${event.nickname}: `}</span>
						{event.comment}
					</li>
				))}
			</ul>
			{userScrolledUp && (
				<button onClick={scrollDown} disabled={chatMessages.length === 0}>
					Scroll Down
				</button>
			)}
		</div>
	);
}
