import '../sections/styles/travelbot.css'
import { useState } from 'react';

export default function TravelBot({ info }) {
    const [value, setValue] = useState('');
    const [aiReply, setAiReply] = useState()

    const country = info?.country?.name?.common
    console.log(aiReply, country)

    const getMessage = async (country) => {

        const options = {
            method: 'POST',
            body: JSON.stringify({
                mesage: `${country}: ${value}`
            }),
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const response = await fetch('https://earthroulette.net/.netlify/functions/botreply', options);
            const data = await response.json()
            setAiReply(data?.choices[0].message)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="travelbot-container">
            <h1>travelbot</h1>
            <div className='travelbot-input'>
                <input value={value} onChange={(e) => setValue(e.target.value)}></input>
                <button onClick={getMessage}>Enter</button>
            </div>
        </div>
    )
}