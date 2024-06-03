import './hero-section.css'
import EarthAnimation from '../components/Animation Earth.json'
import EarthAnimationDark from '../components/Animation EarthDark.json'
import PlaneAnimation from '../components/Animation plane.json'
import Lottie from 'lottie-react'
import useLocalStorage from 'use-local-storage'
import axios from 'axios'
import { useState } from 'react'

export default function HeroSection() {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isLight, setIsLight] = useLocalStorage('isLight', preference);
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
            console.log('Fetched Country Data:', randomCountry.name.common); // Log the fetched country data
        } catch (error) {
            setError(error.message);
            console.log('Error fetching country:', error); // Log the error object
        }
    };

    return (
        <div className='section'>
            <div className='container'>
                <Lottie
                    className='earth-animation'
                    animationData={isLight ? EarthAnimationDark : EarthAnimation}
                />
                {/* <Lottie
                    className='earth-animation'
                    animationData={PlaneAnimation} /> */}
                <div className='hero-text'>
                    <h1>Earth Roulette</h1>
                    <p>Hey there! Feeling the wanderlust but not sure where to go next? Let me help! This app will whisk you away on a virtual adventure by selecting a random country for you to explore. <br />   But that's not all! I'll also show you the current weather there to help you pack, and highlight some upcoming dates and events to get your trip planning started. Think the chosen destination sounds like your dream vacation?  No problem! I'll even provide a quick link to booking flights, so you can turn this virtual trip into reality.
                        Ready to discover your next adventure? Let's get started!</p>
                    <Button />
                </div>
            </div>
        </div>
    )
}

function Button() {
    const handleScroll = () => {
        const countrySection = document.getElementById('country-container'); // Get reference to CountrySection
        if (countrySection) {
            countrySection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll animation
        }
    };
    return (
        <div>
            <button onClick={handleScroll}>Take Me!</button>
        </div>
    )
}

