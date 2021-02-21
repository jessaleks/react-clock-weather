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
	const baseUrl = 'https://api.weatherapi.com/v1/forecast.json?key=' + apiKey;
	var [time, setTime] = useState(new Date().toLocaleTimeString('pl-PL'));
	var lat;
	var lng;
	const [jsonResponse, setJsonResponse] = useState(null);
	const [error, setError] = useState(null);

	function getWeather(latitude, longitude) {
		fetch(`${baseUrl}&q=${latitude},${longitude}`)
			.then((res) => res.json())
			.then((data) => {
				setJsonResponse(data);
				console.log(jsonResponse);
			})
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
				// lat and lng have to be normal variables bc otherwise the app bugs out and displays weather for... Mexico.
				// I can't use useState because then the function runs once with the initial values (both variables being 0)
				// and then the second time with the actual coordinates
				lat = Math.round(position.coords.latitude * 1000) / 1000;
				lng = Math.round(position.coords.longitude * 1000) / 1000;
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
	}, []);

	return (
		<div className="bg-gray-800 h-screen w-screen">
			{error ? (
				<div className=" text-center py-4 bg-red-300 text-red-900">
					{error.toString()}
				</div>
			) : null}
			<div className="mx-auto top-1/2 d-flex flex-col items-center justify-around text-white my-auto container">
				<h2 className="text-8xl mt-auto text-center">{time}</h2>
				{jsonResponse ? (
					<p className="text-2xl mt-2 text-center">
						Current temperature in {jsonResponse.location.name} is{' '}
						{jsonResponse.current.temp_c} C.
					</p>
				) : null}
			</div>
		</div>
	);
}

export default App;
