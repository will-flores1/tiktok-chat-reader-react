/* eslint-disable react/prop-types */
export function ConnectionState({ isConnected, liveConnected }) {
	// animated flashing red dot
	const style = {
		live: {
			display: "inline-block",
			width: "10px",
			height: "10px",
			backgroundColor: "red",
			borderRadius: "50%",
			animation: "blinker 2s linear infinite",
		},
	};
	return (
		<div>
			{isConnected ? (
				<p className="bold success">Server Connected</p>
			) : (
				<p className="bold warning">Must start Server in the backend!!</p>
			)}
			{liveConnected ? (
				<p className="bold">
					<span style={style.live}></span> TikTok Live Connected
				</p>
			) : (
				<p>TikTok Live Not Connected</p>
			)}
		</div>
	);
}
