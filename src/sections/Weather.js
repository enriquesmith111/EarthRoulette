import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import ClearSkyDay from '../components/ clear sky day.json'
import ClearSkyNight from '../components/clear sky night.json'
import Fog from '../components/Fog.json'
import CloudyDay from '../components/half cast day.json'
import CloudyNight from '../components/half cast night.json'
import RainDay from '../components/rain day.json'
import RainNight from '../components/rain night.json'
import Snow from '../components/snow.json'
import Thunderstorm from '../components/thunderstorm.json'

export default function Weather({ info, loading }) {
    const country = info?.country
    const [daytime, setIsDaytime] = useState(null);
    const loadingClass = loading ? 'loading' : '';

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
            <div className={country ? daytime !== null ? daytime ? "weather-day" : "weather-night" : "weather-default" : "weather-default"}>
                {country && ( // Ensure country exists before rendering content
                    <>
                        <div className='icon-capital-temp'>
                            <div className='icon-and-capital'>
                                <WeatherIcon daytime={daytime} info={info} />
                                <WeatherLocation info={info} loading={loading} />
                            </div>
                            <WeatherTemp info={info} loading={loading} />
                        </div>
                        <WeatherWeek daytime={daytime} info={info} loading={loading} />
                    </>
                )}
                {!country && <h4 className={`${loadingClass}`}>Press Spin for a Weather</h4>}
            </div>
        </div>
    );
}

function WeatherIcon({ daytime, info }) {
    const country = info?.country
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

function WeatherLocation({ info, loading }) {
    const loadingClass = loading ? 'loading' : '';
    const country = info?.country
    return (
        <>
            {<h4 className={`${loadingClass}`}>{country ? country?.capital : ''},</h4>}
            {<h4 className={`${loadingClass}`}>{country?.name.common}</h4>}
        </>
    )
}

function WeatherTemp({ info, loading }) {
    const country = info?.country
    const loadingClass = loading ? 'loading' : '';
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
            {<h1 className={`${loadingClass}`}>{temp}°c</h1>}
            {<h1 className={`${loadingClass}`}>{((temp * 9 / 5) + 32).toFixed(2)}°F</h1>}
        </div>
    );
}

function WeatherWeek({ daytime, info, loading }) {
    const country = info?.country
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
                            <WeatherDay dayData={dayData} key={dayData.dt} daytime={daytime} loading={loading} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

function WeatherDay({ dayData, daytime, loading }) {
    const weather = dayData?.weather?.[0]?.main
    const loadingClass = loading ? 'loading' : '';
    const [weatherIcon, setWeatherIcon] = useState(null);
    const monthDay = dayData.dt_txt.slice(5, 10);

    useEffect(() => {
        const getWeatherIcon = () => {

            switch (weather) { // Handle potential undefined values
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
    }, [dayData, daytime, weather]);

    return (
        <div className='day-weather-of-week'>
            {<h4 className={`${loadingClass}`}>{monthDay}</h4>}
            <Lottie
                className='weather-week-animation'
                animationData={weatherIcon} />
            {<h4 className={`${loadingClass}`}>{Math.round(dayData?.main.temp)}°c</h4>}
        </div>
    )
}