const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());

exports.handler = async (event, context) => {
    const req = event; // Access the request object from the event
    const res = {
        statusCode: 200, // Set default status code
        headers: {
            'Content-Type': 'application/json', // Set default content type
            'Access-Control-Allow-Origin': '*',
        },
        body: '',
    };

    try {

        // Attempt to fetch random country from live API
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;
        const randomIndex = Math.floor(Math.random() * countries.length);

        // Attempt to fetch random country image
        const randomCountry = countries[randomIndex];
        const imageUrl = `https://api.unsplash.com/search/photos?query=${randomCountry?.name?.common}&random&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`;

        // Attempt to fetch random Country capital day weather
        const api = {
            key: `${process.env.REACT_APP_WEATHER_API_KEY}`,
            base: 'https://api.openweathermap.org/data/2.5/',
        };

        const lat = randomCountry?.capitalInfo.latlng[0];
        const lon = randomCountry?.capitalInfo.latlng[1];

        const responseWeather = await fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`);
        const weatherResults = await responseWeather.json();

        // Attempt to fetch random Country capital week weather
        const location = randomCountry?.capital;
        const weekApi = {
            key: '16842ae1a21473b7ab24bd137fd9b4b1',
            base: 'https://api.openweathermap.org/data/2.5/forecast?q=',
        };

        const responseWeek = await fetch(`${weekApi.base}${location}&units=metric&appid=${weekApi.key}`);
        const resultsWeek = await responseWeek.json();

        // Attempt to fetch openAi country info
        // const optionsText = {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         model: 'gpt-3.5-turbo',
        //         messages: [{ role: 'user', content: `give me a paragraph of some general facts about ${randomCountry?.name.common}` }],
        //         max_tokens: 200,
        //     })
        // };
        // const responseAIText = await fetch('https://api.openai.com/v1/chat/completions', optionsText);
        // const aiDataText = await responseAIText.json();

        // Attempt to fetch openAi cities JSON
        const optionsJSON = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                response_format: { type: "json_object" },
                messages: [{
                    role: "system",
                    content: `You provide JSON object with longitude and latitude of up to 7 best cities or places to visit in a country following this JSON format: 
                    {
                        "locations": [
                            {
                                "name": "Koror",
                                "description": "Koror City is the largest city and the commercial center in Palau, home to about half of the country's population, located on Koror Island",
                                "latitude": 7.341944,
                                "longitude": 134.479167
                            },
                        ]
                    }`,
                },
                { role: "user", content: `${randomCountry?.name.common}` },
                ],
                max_tokens: 500,
            })
        };
        const responseAIJSON = await fetch('https://api.openai.com/v1/chat/completions', optionsJSON);
        const aiDataJSON = await responseAIJSON.json();


        // attempt to fetch Geoapify boundaries API
        var fetchBoundary = require('node-fetch');
        var requestOptions = {
            method: 'GET',
        };
        const responseBoundary = await fetchBoundary(`https://api.geoapify.com/v1/boundaries/part-of?lon=${lon}&lat=${lat}&geometry=geometry_10000&boundary=political&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`, requestOptions);
        const boundaryData = await responseBoundary.json();
        console.log('border api')
        console.log(boundaryData);

        // Save data in JSON object
        const responseData = {
            country: randomCountry,
            imageUrl,
            weather: weatherResults,
            weatherWeek: resultsWeek,
            // aiData: aiDataText,
            aiJSON: aiDataJSON,
            boundary: boundaryData,
        };

        res.body = JSON.stringify(responseData); // Set the response body
    } catch (error) {
        console.error('Error fetching countries info:', error);
        res.statusCode = 500;
        res.body = JSON.stringify({ message: 'Internal Server Error' });
    }

    return res;
};