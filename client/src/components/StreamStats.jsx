import React from "react";

export function StreamStats({ viewerCount, likeCount }) {
	const css = {
		bold: {
			fontWeight: "bold",
		},
	};

	return (
		<div>
			Viewers: <span style={css.bold}>{viewerCount}</span> Likes:{" "}
			<span style={css.bold}>{likeCount}</span>
			{/* Total Coins:{" "}<span style={css.bold}>{coinCount}</span> */}
		</div>
	);
}
