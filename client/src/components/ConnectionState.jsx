/* eslint-disable react/prop-types */
export function ConnectionState({ isConnected, liveConnected }) {
	return (
		<div>
			{liveConnected ? (
				<p class="bold">🔴 Live Connected</p>
			) : (
				<p>Live Disconnected</p>
			)}
			<p>Socket connection: {isConnected.toString()}</p>
		</div>
	);
}
