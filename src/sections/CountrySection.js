import './country-section.css'
import Lottie from 'lottie-react'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, GeoJSON, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
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

export default function CountrySection() {
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleSpin = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://earthroulette.net/.netlify/functions/info`);
            setInfo(response?.data)
            setLoading(null)
            console.log(response?.data)

        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className='section'>
            <div className='container' id='country-container'>
                <InfoAndImage info={info} loading={loading} error={error} />
                <div className='text-weather-buttons'>
                    <div className='country-text'>
                        <CountryText info={info} loading={loading} />
                    </div>
                    <div className='weather-and-buttons'>
                        <Weather info={info} loading={loading} />
                        <div className='weather-buttons'>
                            <SpinButton onClick={handleSpin} loading={loading} />
                            <SearchButton info={info} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='container' style={{ marginTop: '120px', marginBottom: '120px' }}>
                <Map info={info} loading={loading} />
            </div>
        </div >
    )
}

// LEFT SECTION
function InfoAndImage({ info, loading }) {
    return (
        <div className='info-and-image'>
            <CountryInfo info={info} loading={loading} />
            <CountryImage info={info} loading={loading} />
        </div>
    )
}

function CountryInfo({ info, loading }) {

    const country = info?.country
    const loadingClass = loading ? 'loading' : '';

    return (
        <div className='country-info' >
            {country ? (
                <>
                    {<img className={`${loadingClass}`} src={country?.flags.svg} alt={`Flag of ${country?.flags.alt}
                    }`}></img>}
                    {<h4 className={`${loadingClass}`}>{country?.name?.common}</h4>}
                    {/* {<h4>{country?.subregion}</h4>} */}
                    {<h4 className={`${loadingClass}`}>{country?.subregion}</h4>}
                </>
            ) : (
                <h4 className={`${loadingClass}`}>Press Spin for a random country</h4>
            )}
        </div>
    )
}


function CountryImage({ info, loading }) {
    const country = info?.country
    const [imageUrl, setImageUrl] = useState(null);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0); // Track current image index
    const loadingClass = loading ? 'loading disabled' : '';


    useEffect(() => {
        const fetchRandomCountryImage = async () => {
            if (!country) return; // Don't fetch if country is not available
            const responseImage = await axios.get(info?.imageUrl)
            const fetchedImages = responseImage.data.results.map(
                (result) => result.urls.regular
            );
            setImages(fetchedImages); // Store all fetched image URLs

            // Set initial image URL (if any)
            if (fetchedImages.length > 0) {
                setImageUrl(fetchedImages[0]);
            }
        };

        fetchRandomCountryImage();
    }, [country, info]);

    const handleImageClickRight = () => {
        // Handle potential edge cases (no images or last image reached)
        if (images.length === 0) {
            console.error('No images available for this country');
            return;
        }

        const nextIndex = (imageIndex + 1) % images.length; // Wrap around if at last image
        setImageIndex(nextIndex);
        setImageUrl(images[nextIndex]);
    };

    const handleImageClickLeft = () => {
        // Handle potential edge cases (no images or last image reached)
        if (images.length === 0) {
            console.error('No images available for this country');
            return;
        }

        const nextIndex = (imageIndex === 0 ? images.length - 1 : imageIndex - 1) % images.length;
        setImageIndex(nextIndex);
        setImageUrl(images[nextIndex]);
    };

    return (
        <div className={`country-image`}>
            {imageUrl ? (
                <>
                    <img src={imageUrl} alt="Random Country" />
                    <button className={`image-change-btn-right ${loadingClass}`}>
                        <i onClick={handleImageClickRight} class="fa-solid fa-angles-right"></i>
                    </button>
                    <button className={`image-change-btn-left ${loadingClass}`}>
                        <i onClick={handleImageClickLeft} class="fa-solid fa-angles-left"></i>
                    </button>
                </>
            ) : (
                <Lottie
                    className={`boarding-pass ${loadingClass}`}
                    animationData={BoardingPass}
                    speed={0.5}
                />
            )}
        </div>
    );
}



// RIGHT SECTION
function CountryText({ info, loading }) {
    const country = info?.country
    const [time, setTime] = useState();
    const loadingClass = loading ? 'loading' : '';
    const aiText = info?.aiData?.choices?.length > 0 ? info?.aiData.choices[0].message.content : null;

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
        <div className={`country-text ${loadingClass}`}>
            <h1 className={`${loadingClass}`}>
                {country?.name.common}
            </h1>
            <p className={`${loadingClass}`}>
                {aiText?.error || aiText === null ? (
                    <>
                        {country?.name.common} also known as {country?.name.official}, a country located in {country?.continents}, more precisely {country?.subregion}, with a population of approximately {country?.population.toLocaleString()} people and it's capital being {country?.capital}. Cars in {country?.name.common} drive on the {country?.car.side} side of the road and the total area of the country is {country?.area.toLocaleString()} square kilometers. The currency used in {country?.name.common} is the {Object.values(country?.currencies)?.[0].name} {country?.currency}. {Object.values(country?.languages).length >= 2 ? `The common languages spoken in the country are ${languages}` : ` The common language spoken is ${Object.values(country?.languages)[0]}`}. People from {country?.name.common} are known as {Object.values(country?.demonyms)?.[0].m}. {Object.values(country?.capital).length >= 2 ? `The time and date in the many capital cities of ${capitals} ` : `The time and date in the capital city of ${Object.values(country?.capital)[0]}`} is {time}
                    </>
                ) : (
                    <>
                        {aiText}
                    </>
                )}
            </p>
        </div>
    )
}

function Weather({ info, loading }) {
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

function SpinButton({ onClick, info, loading }) {
    const country = info?.country
    const loadingClass = loading ? 'loading disabled' : '';

    const handleButtonClick = async () => {
        onClick();
    };

    const buttonText = country ? 'Re-spin' : 'Spin';
    return (
        <>
            <button className={`${loadingClass}`} onClick={handleButtonClick}>{buttonText}</button>
        </>
    )
}

function SearchButton({ info, loading }) {
    const country = info?.country
    const loadingClass = loading ? 'loading disabled' : '';
    const [countryCode, setCountryCode] = useState();

    useEffect(() => {
        const fetchCode = async () => {

            if (!country || !country.capital) return;

            if (info?.weather.sys) {
                setCountryCode(info?.weather.sys.country);
            }
        }
        fetchCode();
    }, [country, info])

    const handleSearchClick = () => {
        window.open(`https://www.skyscanner.net/flights-to/${countryCode}`, "_blank");
    };

    return (
        <>
            <button className={`${loadingClass}`} onClick={handleSearchClick}>Search Flight</button>
        </>
    )
}

function Map({ info, loading }) {
    const [polygonData, setPolygonData] = useState(null);
    const boundaries = info?.boundary;
    const key = Date.now();

    const lat = info?.country?.latlng[0];
    const lng = info?.country?.latlng[1];

    useEffect(() => {
        if (info?.boundary) {
            const boundaries = info?.boundary.features[info?.boundary.features.length - 1];
            setPolygonData({ ...boundaries });

        }
    }, [info?.boundary]);

    const OutlineColor = {
        stroke: true,
        color: "rgba(255, 0, 0, 0.8)",
        weight: 2,
        opacity: 0.7,
        fill: 'true',
        smoothFactor: 0.1,
        interactive: false,
    }


    const RecenterAutomatically = ({ lat, lng, zoom }) => {
        const map = useMap();
        useEffect(() => {
            map.setView([lat, lng], zoom);
        }, [lat, lng, map, zoom]);
        return null;
    }


    return (
        <div className={info ? 'map-container' : ''}>
            {info && (
                <MapContainer center={[lat, lng]} zoom={3.5} scrollWheelZoom={true} style={{ height: '36rem', width: '36rem' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]} />
                    <RecenterAutomatically lat={lat} lng={lng} zoom={3.5} />
                    {boundaries && <GeoJSON key={key} style={OutlineColor} data={polygonData} />}
                </MapContainer>
            )}
        </div>
    )
}