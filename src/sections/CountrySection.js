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
import countriesLocal from '../components/countries.json'

export default function CountrySection() {
    const [country, setCountry] = useState(null);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null)

    // API TAKES TOO LONG TO RESPOND SO I COPIED THE JSON FILE AND ADDED IT TO PROJECT MANUALLY

    const handleSpin = async () => {
        try {
            // Generate a random index within the countries array
            const response = await axios.get(
                `http://localhost:8000/info`
            );
            console.log(response)
            setInfo(response?.data)
            setCountry(response?.data?.country);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='section'>
            <div className='container' id='country-container'>
                <InfoAndImage country={country} info={info} />
                <div className='text-weather-buttons'>
                    <div className='country-text'>
                        <CountryText country={country} info={info} />
                    </div>
                    <div className='weather-and-buttons'>
                        <Weather country={country} info={info} />
                        <div className='weather-buttons'>
                            <SpinButton onClick={handleSpin} country={country} />
                            <SearchButton country={country} info={info} />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

// LEFT SECTION
function InfoAndImage({ country, info }) {
    return (
        <div className='info-and-image'>
            <CountryInfo country={country} />
            <CountryImage country={country} info={info} />
        </div>
    )
}

function CountryInfo({ country }) {

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


function CountryImage({ country, info }) {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchRandomCountryImage = async () => {
            if (!country) return; // Don't fetch if country is not available
            const responseImage = await axios.get(info?.imageUrl)
            // Access the first photo's URL directly
            setImageUrl(responseImage.data.results[Math.floor(Math.random() * 10)].urls.regular);
        };

        fetchRandomCountryImage();
    }, [country, info]);

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
function CountryText({ country, info }) {
    const [time, setTime] = useState();

    useEffect(() => {
        const fetchTime = async () => {
            if (!country || !country.capital) return;
            const timezoneOffset = info?.weather.timezone;
            const currCountryTime = Math.floor(Date.now() / 1000) + timezoneOffset;
            let myDate = new Date(currCountryTime * 1000);
            const formattedTime = myDate.toGMTString().slice(0, -4);
            setTime(formattedTime);
        };

        fetchTime();

    }, [country, info]);


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

function Weather({ country, info }) {
    const [daytime, setIsDaytime] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!country || !country.capital) return;

            if (info?.weather.sys) {
                const sunrise = info?.weather.sys.sunrise + info?.weather.timezone;
                const sunset = info?.weather.sys.sunset + info?.weather.timezone;
                const timezoneOffset = info?.weather.timezone; // Time zone offset in seconds
                const currCountryTime = Math.floor(Date.now() / 1000) + timezoneOffset; // Current time in country's time zone
                const isDay = currCountryTime > sunrise && currCountryTime < sunset;
                setIsDaytime(isDay);
            }
        }
        fetchWeather();
    }, [country, info])
    return (
        <div>
            <div className={country ? daytime !== null ? daytime ? "weather-day" : "weather-night" : "weather-default" : "weather-default" /* Fallback for missing country data */}>
                {country && ( // Ensure country exists before rendering content
                    <>
                        <div className='icon-capital-temp'>
                            <div className='icon-and-capital'>
                                <WeatherIcon country={country} daytime={daytime} info={info} />
                                <WeatherLocation country={country} />
                            </div>
                            <WeatherTemp country={country} info={info} />
                        </div>
                        <WeatherWeek country={country} daytime={daytime} info={info} />
                    </>
                )}
                {/* Alternatively, display a message if country is null: */}
                {!country && <h4>Press Spin for a Weather</h4>}
            </div>
        </div>
    );
}

function WeatherIcon({ country, daytime, info }) {
    const [weather, setWeather] = useState(null);
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!country || !country.capital) return;
            setWeather(info.weather.weather[0].main.toString())

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
    }, [weather, country, daytime, icon, info])



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

function WeatherTemp({ country, info }) {
    const [temp, setTemp] = useState();

    useEffect(() => {
        const fetchTemp = async () => {
            if (!country || !country.capital) return;
            const temperature = info?.weather.main.temp;
            setTemp(temperature)
        }
        fetchTemp();
    }, [country, info])

    return (
        <div className='location-temp'>
            {<h1>{temp}°c</h1>}
            {<h1>{((temp * 9 / 5) + 32).toFixed(2)}°F</h1>}
        </div>
    );
}

function WeatherWeek({ country, daytime, info }) {
    const [weatherWeek, setWeatherWeek] = useState();

    useEffect(() => {
        const fetchWeek = async () => {
            if (!country || !country.capital) return;

            const week = info?.weatherWeek.list;
            const noonWeather = week.filter(day => day.dt_txt.includes('12:00:00'));
            setWeatherWeek(noonWeather);
        };
        fetchWeek();
    }, [country, info]); // Re-run useEffect when country changes // Re-run useEffect when country changes

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








function SpinButton({ onClick, country, }) {
    const buttonText = country ? 'Re-spin' : 'Spin';
    return (
        <>
            <button onClick={onClick}>{buttonText}</button>
        </>
    )
}

function SearchButton({ country, info }) {
    const [countryCode, setCountryCode] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCode = async () => {
            setIsLoading(true);
            if (!country || !country.capital) return;

            if (info?.weather.sys) {
                setCountryCode(info?.weather.sys.country);
            }
            setIsLoading(false);
        }
        fetchCode();
    }, [country, info])

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