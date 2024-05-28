import './country-section.css'
import Lottie from 'lottie-react'
import BoardingPass from '../components/Animation Boarding Pass.json'
import React, { useState, useEffect } from 'react'
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
    const location = country?.capital
    const api = {
        key: '16842ae1a21473b7ab24bd137fd9b4b1',
        base: 'https://api.openweathermap.org/data/2.5/',
    }

    if (!country) return
    else {
        fetch(`${api.base}weather?q=${location}&APPID=${api.key}`)
            .then((res) => res.json())
            .then((results) => {
                console.log(results)
            })
    }

    return (
        <div className='weather'>
            <p>weather</p>
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

function SearchButton() {
    return (
        <>
            <button>Search Flight</button>
        </>
    )
}