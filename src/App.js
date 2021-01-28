import './App.css';
import './index.css';
import { useState, useEffect } from 'react';

function App() {
	// TODO set the locale string automatically based on location
	var [time, setTime] = useState(new Date().toLocaleTimeString('pl-PL'));
	useEffect(() => {
		const timer = setInterval(
			() => setTime(new Date().toLocaleTimeString('pl-PL')),
			1000
		);
		return () => clearInterval(timer);
	}, [time, setTime]);
	return (
		<div className="bg-gray-800 h-screen w-screen">
			<div className="mx-auto d-flex flex-col items-center justify-around text-white my-auto container">
				<h2 className="text-8xl text-center">{time}</h2>
				<p className="text-8xl text-center">❄</p>
			</div>
		</div>
	);
}

export default App;
