import './country-section.css'
import Lottie from 'lottie-react'
import React, { useState, useEffect } from 'react'
import BoardingPass from '../components/Animation Boarding Pass.json'
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

export default function CountrySection({ weather }) {
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
                    <div className='country-text'>
                        <CountryText country={country} />
                    </div>
                    <div className='weather-and-buttons'>
                        <Weather country={country} />
                        <div className='weather-buttons'>
                            <SpinButton onClick={handleSpin} country={country} />
                            <SearchButton country={country} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
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
                    {<img src={country?.flags.svg} alt={`Flag of ${country?.flags.alt}
                    }`}></img>}
                    {<h4>{country?.name?.common}</h4>}
                    {/* {<h4>{country?.subregion}</h4>} */}
                    {<h4>{country?.subregion}</h4>}
                </>
            ) : (
                <h4>Press Spin for a random country</h4>
            )}
        </div>
    )
}


function CountryImage({ country }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiKey = 'NrVRoLjdKk9U4R8hA9nnfmEuu0CJ8YDWLHAm9V4ohXo';
        const fetchRandomCountryImage = async () => {
            if (!country) return; // Don't fetch if country is not available

            try {
                const response = await axios.get(
                    `https://api.unsplash.com/search/photos?query=${country?.name.common}&random&client_id=${apiKey}`
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
                imageUrl && <img src={imageUrl} alt="Random Country" />
            ) : (
                <Lottie
                    className='boarding-pass'
                    animationData={BoardingPass}
                    speed={0.5}
                />
            )}
        </div>
    );
}



// RIGHT SECTION
function CountryText({ country }) {
    const [time, setTime] = useState();

    useEffect(() => {
        const fetchTime = async () => {
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/',
            };

            const response = await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`);
            const results = await response.json();

            const timezoneOffset = results.timezone;
            const currCountryTime = Math.floor(Date.now() / 1000) + timezoneOffset;
            let myDate = new Date(currCountryTime * 1000);
            const formattedTime = myDate.toGMTString().slice(0, -4);
            setTime(formattedTime);
        };
        fetchTime();
    }, [country]);


    if (!country) return;
    const languages = Object.values(country?.languages)
        .slice(0, -1) // Get all elements except the last
        .join(', ') + // Join them with commas
        ' and ' + // Add 'and' before the last element
        Object.values(country?.languages).slice(-1);

    const capitals = Object.values(country?.capital)
        .slice(0, -1) // Get all elements except the last
        .join(', ') + // Join them with commas
        ' and ' + // Add 'and' before the last element
        Object.values(country?.languages).slice(-1);

    return (
        <div className='country-text'>
            <h1>
                {country?.name.common}
            </h1>
            <p>
                {country?.name.common} also known as {country?.name.official}, a country located in {country?.continents}, more precisely {country?.subregion}, with a population of approximately {country?.population.toLocaleString()} people and it's capital being {country?.capital}. Cars in {country?.name.common} drive on the {country?.car.side} side of the road and the total area of the country is {country?.area.toLocaleString()} square kilometers. The currency used in {country?.name.common} is the {Object.values(country?.currencies)?.[0].name} {country?.currency}. {Object.values(country?.languages).length >= 2 ? `The common languages spoken in the country are ${languages}` : ` The common language spoken is ${Object.values(country?.languages)[0]}`}. People from {country?.name.common} are known as {Object.values(country?.demonyms)?.[0].m}. {Object.values(country?.capital).length >= 2 ? `The time and date in the many capital cities of ${capitals} ` : `The time and date in the capital city of ${Object.values(country?.capital)[0]}`} is {time}
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
            console.log(results)
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
                        <div className='icon-capital-temp'>
                            <div className='icon-and-capital'>
                                <WeatherIcon country={country} daytime={daytime} />
                                <WeatherLocation country={country} />
                            </div>
                            <WeatherTemp country={country} />
                        </div>
                        <WeatherWeek country={country} daytime={daytime} />
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

function WeatherWeek({ country, daytime }) {
    const [weatherWeek, setWeatherWeek] = useState();

    useEffect(() => {
        const fetchWeek = async () => {
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/forecast?q=',
            };

            const response = await fetch(`${api.base}${location}&units=metric&appid=${api.key}`);
            const results = await response.json();
            const week = results.list;
            const noonWeather = week.filter(day => day.dt_txt.includes('12:00:00'));
            setWeatherWeek(noonWeather);
        };
        fetchWeek();
        console.log(weatherWeek)
    }, [country]); // Re-run useEffect when country changes // Re-run useEffect when country changes

    return (
        <>
            {weatherWeek && (
                <div className='weather-week'>
                    {weatherWeek.map((dayData) => (
                        <div key={dayData.dt_txt}>
                            <WeatherDay dayData={dayData} key={dayData.dt} daytime={daytime} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function WeatherDay({ dayData, daytime }) {
    const weather = dayData.weather[0].main
    const [weatherIcon, setWeatherIcon] = useState(null);
    const monthDay = dayData.dt_txt.slice(5, 10);

    useEffect(() => {
        const getWeatherIcon = () => {

            switch (dayData?.weather?.[0]?.main) { // Handle potential undefined values
                case 'Clear':
                    return ClearSkyDay;
                case 'Clouds':
                    return CloudyDay;
                case 'Rain':
                    return RainDay;
                case 'Snow':
                    return Snow;
                case 'Thunderstorm':
                    return Thunderstorm;
                default:
                    return Fog;
            }
        };

        setWeatherIcon(getWeatherIcon());
    }, [dayData, daytime]);

    return (
        <div className='day-weather-of-week'>
            {<h4>{monthDay}</h4>}
            <Lottie
                className='weather-week-animation'
                animationData={weatherIcon} />
            {<h4>{Math.round(dayData?.main.temp)}°c</h4>}
        </div>
    )
}








function SpinButton({ onClick, country }) {
    const buttonText = country ? 'Re-spin' : 'Spin';
    return (
        <>
            <button onClick={onClick}>{buttonText}</button>
        </>
    )
}

function SearchButton({ country }) {
    const [countryCode, setCountryCode] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCode = async () => {
            setIsLoading(true);
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/',
            };

            const response = await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`);
            const results = await response.json();
            console.log(results)
            if (results.sys) {
                setCountryCode(results.sys.country);
            }
            setIsLoading(false);
        }
        fetchCode();
    }, [country])

    const handleSearchClick = () => {
        window.open(`https://www.skyscanner.net/flights-to/${countryCode}`, "_blank");
    };

    const isDisabled = countryCode === undefined || isLoading;

    return (
        <>
            <button onClick={handleSearchClick} disabled={isDisabled}>Search Flight</button>
        </>
    )
}