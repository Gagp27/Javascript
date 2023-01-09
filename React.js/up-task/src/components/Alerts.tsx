import React from "react";
import './../styles/Alerts.css';

interface Props { alerts: AlertData; }

interface AlertData { error: boolean, message: string }

const Alerts: React.FC<Props> = ({ alerts }) => {
	return (
		<>
			<div className={`alerts ${(alerts.error) ? 'error' : 'success'}`}>
				{alerts.message}
			</div>
		</>
	)
}

export default Alerts;
