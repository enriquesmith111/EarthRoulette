import './styles/info-and-image.css'
import './styles/country-text.css'
import './styles/country-buttons.css'
import './styles/weather.css'
import './styles/weather-and-buttons.css'
import React, { useState } from 'react'
import InfoAndImage from './InfoAndImage';
import CountryText from './CountryText';
import Weather from './Weather';
import SpinButton from './SpinButton';
import SearchButton from './SearchButton';
import Map from './Map';
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
        <>
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
            </div >
            <div className='section'>
                <div className='container'>
                    <Map info={info} loading={loading} />
                </div>
            </div>
        </>
    )
}
