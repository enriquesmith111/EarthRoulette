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
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et libero natus blanditiis tenetur laboriosam id sed ratione quia aspernatur, vero praesentium animi doloribus quidem recusandae nihil accusantium? Earum soluta, dicta libero totam doloremque facere nemo eveniet, maxime quod quis tempore repellendus, commodi facilis. Aut fuga asperiores ducimus animi facere eveniet.</p>
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

