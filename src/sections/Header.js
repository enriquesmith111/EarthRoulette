import './header.css'
import lightLogo from '../components/dark-logo.png'
import darkLogo from '../components/light-logo.png'
import useLocalStorage from 'use-local-storage'

export default function Header() {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches
    const [isLight, setIsLight] = useLocalStorage('isLight', preference)


    return (
        <div className='header'>
            <img
                src={isLight ? lightLogo : darkLogo}
                alt='paper-airplane-png'>
            </img>

            <Toggle
                isChecked={isLight}
                handleChange={() => setIsLight(!isLight)}
            />
        </div>
    )
}

const Toggle = ({ handleChange, isChecked }) => {
    return (
        <div className='toggle-container'>
            <input
                type='checkbox'
                id='check'
                className='toggle'
                onChange={handleChange}
                checked={isChecked} />
            <label htmlFor='check'>{isChecked ? 'Light Mode' : 'Dark Mode'}</label>
        </div>
    );
}
