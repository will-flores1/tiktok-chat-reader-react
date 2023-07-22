/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

export function Gifts({ gifts }) {
	const styles = {
		wrapper: {
			display: "flex",
			flexDirection: "column",
			flexGrow: "1",
			justifyContent: "space-between",
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
	};

	return (
		<div style={styles.wrapper}>
			<h2>Gifts</h2>
			<ul style={styles.listStyle}>
				{gifts.map((event, index) => (
					<li key={index}>{event.giftName}</li>
				))}
			</ul>
		</div>
	);
}
