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
import TravelBot from './TravelBot'
import Footer from './Footer'
import axios from 'axios'

export default function CountrySection() {
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleSpin = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://earthroulette.net/.netlify/functions/info`);
            // const response = await fetch(`http://localhost:8001/info`);
            const data = await response.data;
            setInfo(data)
            setLoading(null)
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <>
            <div id='country' className='section'>
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
            {info && (
                <div className='section'>
                    <div className='container'>
                        <Map info={info} loading={loading} />
                        <TravelBot info={info} loading={loading} />
                    </div>
                </div>
            )}
            <Footer />
        </>
    )
}
