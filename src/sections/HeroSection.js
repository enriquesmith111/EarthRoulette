import './styles/hero-section.css'
import EarthAnimation from '../components/Animation Earth.json'
import EarthAnimationDark from '../components/Animation EarthDark.json'
import Lottie from 'lottie-react'
import useLocalStorage from 'use-local-storage'

export default function HeroSection() {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isLight] = useLocalStorage('isLight', preference);

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
                    <p>Hey there! Feeling the wanderlust but not sure where to go next? Let me help! This app will whisk you away on a virtual adventure by selecting a random country for you to explore.</p>
                    <p>But that's not all! I'll also show you the current weather there to help you pack, and highlight some upcoming dates and events to get your trip planning started.</p>
                    <p>Plus, with the power of AI, I can provide you with a personalized summary of the chosen country, including fascinating facts, must-do activities, and hidden gems. Think the chosen destination sounds like your dream vacation?  No problem! I'll even provide a quick link to booking flights, so you can turn this virtual trip into reality.</p>
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

