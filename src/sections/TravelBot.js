import '../sections/styles/travelbot.css'
import { useEffect, useState } from 'react';

export default function TravelBot({ info }) {
    const [loading, setLoading] = useState()
    const loadingClass = loading ? 'loading' : '';
    const [value, setValue] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
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
            setLoading(true)
            const response = await fetch('https://earthroulette.net/.netlify/functions/botreply', options);
            // const response = await fetch('http://localhost:8000/reply', options)
            const data = await response.json();
            const content = data?.choices[0]?.message?.content
            setAiReply(content);
            setConversationHistory([{ userQuestion: value, aiReply: content }, ...conversationHistory,]);
            setLoading(false)

        } catch (error) {
            console.error('Error making API call:', error);
            setError(error.message);  // Set error message state
        }
    };

    useEffect(() => {
        if (country) {
            setConversationHistory([]); // Clear conversation history on new country
        }
    }, [country]);

    console.log(error)

    return (
        <div className={`travelbot-container ${loadingClass}`}>
            <h2>Travelbot</h2>
            <div className='ai-reply-container'>
                {conversationHistory.map((message, index) => (
                    <div key={index} className="message-item">
                        <h3 className="user-message">{message.userQuestion}</h3>
                        <p className="ai-message">{message.aiReply}</p>
                    </div>
                ))}
            </div>
            <div className='travelbot-input'>
                <input className='input' value={value} onChange={(e) => setValue(e.target.value)}></input>
                <i onClick={getMessage} class="fa-solid fa-paper-plane"></i>
            </div>
        </div>
    )
}