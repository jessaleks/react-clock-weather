import './App.css';
import './index.css';
import { useState, useEffect } from 'react';

function App() {
	// TODO set the locale string automatically based on location
	// TODO set the location automatically using https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
	// TODO Consume the weather api from https://openweathermap.org/current
	// ? Maybe set up a search box for the user so that he/she is able to look up the weather in another location

	// the api key weatherapi.com
	// I can leave it here since it does not really matter if I do.
	// In another cases, I would set an env variable
	const apiKey = '28ae6e013ff441e4bcc115110212901';
	const baseUrl = 'http://api.weatherapi.com/v1/forecast.json?key=' + apiKey;
	var [time, setTime] = useState(new Date().toLocaleTimeString('pl-PL'));
	const [lat, setLat] = useState(0);
	const [lng, setLng] = useState(0);
	const [error, setError] = useState(null);

	function getWeather(lat, lng) {
		fetch(`${baseUrl}&q=${lat},${lng}`)
			.then((res) => console.log(res.json()))
			.catch((err) => console.log(err));
	}

	/**
	 * @name getLocation
	 * @description function to get the location of the user, and then, the weather for user's location
	 */
	function getLocationAndWeather() {
		if (!navigator.geolocation) {
			setError('Your browser does not support geolocation');
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLat(Math.round(position.coords.latitude * 100) / 100);
				setLng((Math.round(position.coords.longitude) * 100) / 100);
				getWeather(lat, lng);
			},
			(err) => {
				// in this case, I can manually set the error messages.
				// In opther cases I would set the error to be the same as the error message I get
				switch (err.code) {
					case 1:
						setError(
							'You need to allow geolocation for the weather lookup to work. Please change your settings and refresh.'
						);
						break;
					case 2:
						setError('Your position could not be determined. ');
						break;
					case 3:
						setError('Your position took too long to determine.');
						break;
					default:
						setError('Something went wrong.');
				}
			}
		);
	}

	// setting the timer every second, and clearing the interval every second
	useEffect(() => {
		const timer = setInterval(
			() => setTime(new Date().toLocaleTimeString('pl-PL')),
			1000
		);
		return () => clearInterval(timer);
	}, [time, setTime]);

	// getting the location
	useEffect(() => {
		getLocationAndWeather();
	}, [lat, lng, setLat, setLng]);

	return (
		<div className="bg-gray-800 h-screen w-screen">
			{error ? (
				<div className=" text-center py-4 bg-red-300 text-red-800">
					{error.toString()}
				</div>
			) : null}
			<div className="mx-auto d-flex flex-col items-center justify-around text-white my-auto container">
				<h2 className="text-8xl my-auto text-center">{time}</h2>
				<p className="text-8xl text-center">❄</p>
			</div>
		</div>
	);
}

export default App;
