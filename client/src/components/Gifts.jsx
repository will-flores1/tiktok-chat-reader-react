/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export function Gifts({ gifts }) {
	const ulRef = useRef(null);

	// Scroll to the bottom when new messages come in and the user is not scrolling up
	useEffect(() => {
		if (ulRef.current) {
			ulRef.current.scrollTop = ulRef.current.scrollHeight;
		}
	}, [gifts]);

	const styles = {
		wrapper: {
			display: "flex",
			flexDirection: "column",
			flex: "8 4 0",
		},
		listStyle: {
			display: "flex",
			flexDirection: "column",
			gap: "14px",
			listStyleType: "none",
			overflowY: "scroll",
			overflowX: "hidden",
			height: "calc(100vh - 260px)",
			padding: "0",
			margin: "0",
		},
		listItem: {
			display: "flex",
			flexDirection: "column",
			backgroundColor: "hsl(0deg 0% 10%)",
		},
		profilePicture: {
			width: "24px",
			height: "24px",
			borderRadius: "50%",
			marginRight: "5px",
		},
		text: {
			display: "flex",
			alignItems: "center",
			lineHeight: "1.3",
		},
		gift: {
			display: "flex",
			alignItems: "center",
		},
		giftPicture: {
			width: "48px",
			height: "48px",
		},
		textWrapper: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "space-between",
			marginLeft: "10px",
			lineHeight: "1.3",
		},
	};

	// filter repeat gifts objects with same giftId
	const filteredGifts = gifts.filter(
		(gift, index, self) =>
			index === self.findIndex((t) => t.groupId === gift.groupId)
	);

	return (
		<div style={styles.wrapper}>
			<h2>Gifts</h2>
			<ul ref={ulRef} style={styles.listStyle}>
				{filteredGifts.map((event, index) => (
					<li key={index} style={styles.listItem}>
						<div style={styles.text}>
							<img
								style={styles.profilePicture}
								src={event.profilePictureUrl}
								alt="gifter profile picture"
							/>
							<span style={{ color: "#36a2eb" }}>{event.uniqueId}</span>
							<span>: sent {event.giftName}</span>
						</div>
						<div style={styles.gift}>
							<img
								style={styles.giftPicture}
								src={event.giftPictureUrl}
								alt="gift picture"
							/>
							<div style={styles.textWrapper}>
								<p>
									name:{" "}
									<span style={{ fontWeight: 800 }}>{event.giftName}</span>
									<span> (ID:{event.giftId})</span>
								</p>
								<p>
									repeat:{" "}
									<span style={{ fontWeight: 800 }}>{event.repeatCount}x</span>
								</p>
								<p>
									cost:{" "}
									<span style={{ fontWeight: 800 }}>
										{event.diamondCount * event.repeatCount} coins
									</span>
								</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
