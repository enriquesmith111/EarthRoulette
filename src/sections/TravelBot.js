import '../sections/styles/travelbot.css'
import { useState } from 'react';

export default function TravelBot({ info }) {
    const [value, setValue] = useState('');
    const [aiReply, setAiReply] = useState()
    const country = info?.country?.name?.common
    console.log(aiReply, country)

    const getMessage = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: `${country}: ${value}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

        try {
            const response = await fetch('https://earthroulette.net/.netlify/functions/botreply', options);
            const responseData = await response.json();
            setAiReply(responseData?.choices[0]?.message);
            console.log(responseData);
        } catch (error) {
            console.error('Error making API call:', error);
        }
    };


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