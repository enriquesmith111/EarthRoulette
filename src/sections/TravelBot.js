import '../sections/styles/travelbot.css'
import { useState } from 'react';

export default function TravelBot({ info }) {
    const [value, setValue] = useState('');
    const [aiReply, setAiReply] = useState();
    const [error, setError] = useState(null);  // Capture any error messages
    const country = info?.country?.name?.common

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

            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            setAiReply(responseData?.choices[0]?.message);
            console.log(responseData);
        } catch (error) {
            console.error('Error making API call:', error);
            setError(error.message);  // Set error message state
        }
    };

    console.log(error);
    console.log(aiReply, country)
    return (
        <div className="travelbot-container">
            <h1>travelbot</h1>
            <p className="ai-reply">{aiReply?.content}</p>
            <div className='travelbot-input'>
                <input value={value} onChange={(e) => setValue(e.target.value)}></input>
                <button onClick={getMessage}>Enter</button>
            </div>
        </div>
    )
}