import './hero-section.css'
import EarthAnimation from '../components/Animation Earth.json'
import EarthAnimationDark from '../components/Animation EarthDark.json'
import PlaneAnimation from '../components/Animation plane.json'
import Lottie from 'lottie-react'
import { useRef } from 'react';
import useLocalStorage from 'use-local-storage'

export default function HeroSection() {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches
    const [isLight, setIsLight] = useLocalStorage('isLight', preference)

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
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita non alias ut saepe iusto hic qui consequatur nostrum nemo similique.</p>
                    <button>Spin</button>
                </div>
            </div>
        </div>
    )
}

