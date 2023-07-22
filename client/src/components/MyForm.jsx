import { useState } from "react";
import { socket } from "../socket.js";

export function MyForm({ isConnected }) {
	const [value, setValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	function onSubmit(event) {
		event.preventDefault();
		setIsLoading(true);

		socket.timeout(5000).emit("set-username", value, () => {
			setIsLoading(false);
		});

		setValue("");
	}

	const styles = {
		wrapper: {
			marginTop: "1rem",
			lineHeight: "1",
		},
		form: {},
	};

	return (
		<div style={styles.wrapper}>
			<p>
				Enter the <span className="bold">@username</span> of a user who is
				currently live:
			</p>
			<form style={styles.form} onSubmit={onSubmit}>
				<label htmlFor="username">Username: </label>
				<input
					name="username"
					placeholder="ex. JohnDoe"
					disabled={!isConnected || isLoading}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button type="submit" disabled={!isConnected || isLoading}>
					Submit
				</button>
			</form>
		</div>
	);
}
