import './country-section.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function CountrySection() {
    return (
        <div className='section'>
            <div className='container'>
                <InfoAndImage />
                <div className='text-weather-buttons'>
                    <CountryText />
                    <div className='weather-and-buttons'>
                        <Weather />
                        <Button />
                    </div>
                </div>
            </div>
        </div>
    )
}

// LEFT SECTION
function InfoAndImage() {
    return (
        <div className='info-and-image'>
            <CountryInfo />
            <CountryImage />
        </div>
    )
}

function CountryInfo() {
    return (
        <div className='country-info'>
            <p>country name</p>
            <p>flag</p>
            <p>currency $</p>
        </div>
    )
}


function CountryImage() {
    const apiKey = 'NrVRoLjdKk9U4R8hA9nnfmEuu0CJ8YDWLHAm9V4ohXo';
    const [imageUrl, setImageUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRandomCountryImage = async () => {
            try {
                const response = await axios.get(
                    `https://api.unsplash.com/search/photos?query=spain&random&client_id=${apiKey}`
                );
                // Access the first photo's URL directly
                setImageUrl(response.data.results[Math.floor(Math.random() * 10)].urls.regular);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchRandomCountryImage();
    }, []);

    return (
        <div className='country-image'>
            {imageUrl && <img src={imageUrl} alt="Random Country" />}
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

function Weather() {
    return (
        <div className='weather'>

        </div>
    )
}

function Button() {
    return (
        <div className='weather-buttons'>
            <button>Spin Again</button>
            <button>Search Flights</button>
        </div>
    )
}