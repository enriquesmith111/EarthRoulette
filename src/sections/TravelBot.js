import '../sections/styles/travelbot.css'
import { useEffect, useState } from 'react';

export default function TravelBot({ info }) {
    const [loadingResponse, setLoadingResponse] = useState()
    const loadingClassResponse = loadingResponse ? 'loading-response disabled' : '';
    const [value, setValue] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [aiReply, setAiReply] = useState();
    const country = info?.country?.name?.common

    const getMessage = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: `${country}: ${value}`,
                conversationHistory,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }

        try {
            setLoadingResponse(true)
            const response = await fetch('https://earthroulette.net/.netlify/functions/botreply', options);
            // const response = await fetch('http://localhost:8000/reply', options)
            const data = await response.json();
            const content = data?.choices[0]?.message?.content
            setAiReply(content);
            setConversationHistory([{ userQuestion: value, aiReply: content }, ...conversationHistory,]);
            setValue('');
            setLoadingResponse(false)

        } catch (error) {
            console.error('Error making API call:', error);
        }
    };

    useEffect(() => {
        if (country) {
            setConversationHistory([]); // Clear conversation history on new country
        }
    }, [country]);

    // console.log(conversationHistory)

    return (
        <div id='travelbot' className='travelbot-container'>
            <h2>Travelbot</h2>
            <div className='ai-reply-container'>
                {aiReply && conversationHistory.map((message, index) => (
                    <div key={index} className="message-item">
                        <h3 className='user-message'>{message.userQuestion}</h3>
                        <p className="ai-message">{message.aiReply}</p>
                    </div>
                ))}
            </div>
            <div className='travelbot-input'>
                <input
                    className={`input ${loadingClassResponse}`}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="ask Travelbot about your trip"
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            getMessage(); // Call your function to send the message
                        }
                    }}
                />
                <i onClick={getMessage} class={`fa-solid fa-paper-plane ${loadingClassResponse}`}></i>
            </div>
        </div>
    )
}