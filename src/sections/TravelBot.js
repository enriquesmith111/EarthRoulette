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
            }
        }

        try {
            const response = await fetch('https://earthroulette.net/.netlify/functions/botreply', options);
            // const response = await fetch('http://localhost:8000/reply', options)
            const data = await response.json();
            const content = data?.choices[0]?.message?.content
            setAiReply(content)

        } catch (error) {
            console.error('Error making API call:', error);
            setError(error.message);  // Set error message state
        }
    };

    console.log(error)

    return (
        <div className="travelbot-container">
            <h2>Travelbot</h2>
            <p className="ai-reply">{aiReply}</p>
            <div className='travelbot-input'>
                <input className='input' value={value} onChange={(e) => setValue(e.target.value)}></input>
                <i onClick={getMessage} class="fa-solid fa-paper-plane"></i>
            </div>
        </div>
    )
}