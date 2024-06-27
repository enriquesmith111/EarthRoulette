import '../sections/styles/travelbot.css'

export default function TravelBot({ info }) {
    // const country = info?.country?.name?.common

    const getMessage = async () => {

        const options = {
            method: 'POST',
            body: JSON.stringify({
                mesage: 'restaurants'
            }),
            headers: {
                'Content-type': 'application/json'
            }
        }

        try {
            const response = await fetch('https://earthroulette.net/.netlify/functions/botreply', options);
            const data = response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="travelbot-container">
            <h1>travelbot</h1>
            <div className='travelbot-input'>
                <input></input>
                <button onClick={getMessage}>Enter</button>
            </div>
        </div>
    )
}