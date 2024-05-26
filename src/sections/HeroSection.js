import './hero-section.css'
import EarthAnimation from '../components/Animation Earth.json'
import PlaneAnimation from '../components/Animation plane.json'
import Lottie from 'lottie-react'
import { useRef } from 'react';

export default function HeroSection() {

    return (
        <div className='section'>
            <div className='container'>
                <Lottie
                    className='earth-animation'
                    animationData={EarthAnimation}
                />
                {/* <Lottie
                    className='earth-animation'
                    animationData={PlaneAnimation} /> */}
                <div className='hero-text'>
                    <h1>Earth Roulette</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita non alias ut saepe iusto hic qui consequatur nostrum nemo similique.</p>
                    <button>Button</button>
                </div>
            </div>
        </div>
    )
}

