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
            country: `${country}`,
            message: `${value}`, // Include the country variable here
        };

        const options = {
            method: 'POST',
            body: JSON.stringify({
                mesage: JSON.stringify(data)
            }),
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const response = await axios.get('https://earthroulette.net/.netlify/functions/botreply', options);
            const data = await response.data
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