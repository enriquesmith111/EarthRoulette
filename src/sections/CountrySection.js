import './country-section.css'
import Lottie from 'lottie-react'
import BoardingPass from '../components/Animation Boarding Pass.json'
import React, { useState, useEffect } from 'react'
import ClearSkyDay from '../components/ clear sky day.json'
import ClearSkyNight from '../components/clear sky night.json'
import Fog from '../components/Fog.json'
import CloudyDay from '../components/half cast day.json'
import CloudyNight from '../components/half cast night.json'
import RainDay from '../components/rain day.json'
import RainNight from '../components/rain night.json'
import Snow from '../components/snow.json'
import Thunderstorm from '../components/thunderstorm.json'
import axios from 'axios'

export default function CountrySection() {
    const [country, setCountry] = useState(null);
    const [error, setError] = useState(null);

    // ... existing code for fetching country data (useEffect, etc.)

    const handleSpin = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            const countries = response.data; // Array of all countries

            // Generate a random index within the countries array
            const randomIndex = Math.floor(Math.random() * countries.length);
            const randomCountry = countries[randomIndex];

            setCountry(randomCountry);
            console.log('Fetched Country Data:', randomCountry); // Log the fetched country data
        } catch (error) {
            setError(error.message);
            console.log('Error fetching country:', error); // Log the error object
        }
    };


    return (
        <div className='section'>
            <div className='container' id='country-container'>
                <InfoAndImage country={country} />
                <div className='text-weather-buttons'>
                    <CountryText />
                    <div className='weather-and-buttons'>
                        <Weather country={country} />
                        <div className='weather-buttons'>
                            <SpinButton onClick={handleSpin} country={country} />
                            <SearchButton />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// LEFT SECTION
function InfoAndImage({ country }) {
    return (
        <div className='info-and-image'>
            <CountryInfo country={country} />
            <CountryImage country={country} />
        </div>
    )
}

function CountryInfo({ country }) {
    // console.log(country.currencies)
    return (
        <div className='country-info'>
            {country ? (
                <>
                    {<img src={country?.flags.svg} alt={`Flag of ${country?.name.common}`}></img>}
                    {<h4>{country?.name?.common}</h4>}
                    {/* {<h4>{country?.subregion}</h4>} */}
                    {<h4>Currency: {country?.currencies?.[Object.keys(country.currencies)[0]].name}</h4>}
                </>
            ) : (
                <h4>Press Spin for a random country</h4>
            )}
        </div>
    )
}


function CountryImage({ country }) {
    const apiKey = 'NrVRoLjdKk9U4R8hA9nnfmEuu0CJ8YDWLHAm9V4ohXo';
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRandomCountryImage = async () => {
            if (!country) return; // Don't fetch if country is not available

            try {
                const response = await axios.get(
                    `https://api.unsplash.com/search/photos?query=${country?.name?.common}&random&client_id=${apiKey}`
                );
                // Access the first photo's URL directly
                setImageUrl(response.data.results[Math.floor(Math.random() * 10)].urls.regular);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchRandomCountryImage();
    }, [country]);

    return (
        <div className='country-image'>
            {imageUrl ? (
                <img src={imageUrl} alt="Random Country" />
            ) : (
                <Lottie
                    className='boarding-pass'
                    animationData={BoardingPass}
                    speed={0.5}
                />
            )}
            {error && <p>Error fetching image: {error}</p>}
        </div>
    );
}

// RIGHT SECTION
function CountryText() {
    return (
        <div className='country-text'>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur nam quia eum? Quibusdam blanditiis beatae odit officiis neque adipisci veritatis atque illum deserunt fugiat, quisquam quod. Culpa ex quos totam sequi et qui nesciunt accusantium neque? Aliquid, ratione! Explicabo, dignissimos?
            </p>
        </div>
    )
}

function Weather({ country }) {
    const [daytime, setIsDaytime] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/',
            };

            const response = await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`);
            const results = await response.json();

            if (results.sys) {
                const sunrise = results.sys.sunrise + results.timezone;
                const sunset = results.sys.sunset + results.timezone;
                const timezoneOffset = results.timezone; // Time zone offset in seconds
                const currCountryTime = Math.floor(Date.now() / 1000) + timezoneOffset; // Current time in country's time zone
                const isDay = currCountryTime > sunrise && currCountryTime < sunset;
                setIsDaytime(isDay);
            }
        }
        fetchWeather();
    }, [country])
    return (
        <div>
            <div className={country ? daytime !== null ? daytime ? "weather-day" : "weather-night" : "weather-default" : "weather-default" /* Fallback for missing country data */}>
                {country && ( // Ensure country exists before rendering content
                    <>
                        <div className='icon-and-capital'>
                            <WeatherIcon country={country} daytime={daytime} />
                            <WeatherLocation country={country} />
                        </div>
                        <WeatherTemp country={country} />
                    </>
                )}
                {/* Alternatively, display a message if country is null: */}
                {!country && <h4>Press Spin for a Weather</h4>}
            </div>
        </div>
    );
}

function WeatherIcon({ country, daytime }) {
    const [weather, setWeather] = useState(null);
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/',
            };

            const response = await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`);
            const results = await response.json();
            console.log(results)
            setWeather(results.weather[0].main.toString())

            const getWeatherIcon = () => {
                const isDaytime = !!daytime; // Convert truthy/falsy to boolean
                switch (weather) {
                    case 'Clear':
                        return isDaytime ? ClearSkyDay : ClearSkyNight;
                    case 'Clouds':
                        return isDaytime ? CloudyDay : CloudyNight;
                    case 'Rain':
                        return isDaytime ? RainDay : RainNight;
                    case 'Snow':
                        return Snow;
                    case 'Thunderstorm':
                        return Thunderstorm;
                    default:
                        return Fog;
                }
            };
            setIcon(getWeatherIcon());
        }
        fetchWeather();
    }, [weather, country, daytime, icon])



    return (
        <div className='weather-icon'>
            <Lottie
                className='weather-animation'
                animationData={icon} />
        </div>
    )
}

function WeatherLocation({ country }) {
    return (
        <>
            {<h4>{country ? country?.capital : ''},</h4>}
            {<h4>{country?.name.common}</h4>}
        </>
    )
}

function WeatherTemp({ country }) {
    const [temp, setTemp] = useState();

    useEffect(() => {
        const fetchTemp = async () => {
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/',
            };

            const response = await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`);
            const results = await response.json();
            const temperature = results?.main.temp;
            setTemp(temperature)
        }
        fetchTemp();
    }, [country])

    return (
        <div className='location-temp'>
            {<h1>{temp}°c</h1>}
            {<h1>{((temp * 9 / 5) + 32).toFixed(2)}°F</h1>}
        </div>
    );
}






function SpinButton({ onClick, country }) {
    const buttonText = country ? 'Re-spin' : 'Spin';
    return (
        <>
            <button onClick={onClick}>{buttonText}</button>
        </>
    )
}

function SearchButton() {
    return (
        <>
            <button>Search Flight</button>
        </>
    )
}