import axios from 'axios';
import '../sections/styles/travelbot.css'
import { useState } from 'react';

export default function TravelBot({ info }) {
    const [value, setValue] = useState('');
    const [aiReply, setAiReply] = useState()
    const country = info?.country?.name?.common
    console.log(aiReply, country)

    const getMessage = async () => {
        const data = {
            country: country,
            message: value,
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: data,
            })
        };

        try {
            const response = await axios('https://earthroulette.net/.netlify/functions/botreply', options);
            const responseData = response.data;
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