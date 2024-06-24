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
        console.log('Countries API')

        // varibles needed for apis below to fetch from country information
        const randomCountry = countries[randomIndex];
        const lat = randomCountry?.capitalInfo.latlng[0];
        const lon = randomCountry?.capitalInfo.latlng[1];
        const location = randomCountry?.capital;

        // Prepare API endpoints
        const imageUrl = `https://api.unsplash.com/search/photos?query=${randomCountry?.name?.common}&random&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`;
        const weekWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
        const geoapifyUrl = `https://api.geoapify.com/v1/boundaries/part-of?lon=${lon}&lat=${lat}&geometry=geometry_10000&boundary=political&apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`;

        // OpenAI requests
        const aiTextOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: `give me a paragraph of some general facts about ${randomCountry?.name?.common}` }],
                max_tokens: 200,
            }),
        };

        const aiJsonOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
                'Content-Type': 'application/json',
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
                { role: "user", content: `${randomCountry?.name?.common}` },
                ],
                max_tokens: 500,
            }),
        };

        // Initiate all API requests concurrently
        const [imageResponse, weatherResponse, weekWeatherResponse, aiTextResponse, aiJsonResponse, geoapifyResponse] = await Promise.all([
            axios.get(imageUrl), console.log('image'),
            fetch(weatherUrl).then(res => res.json()), console.log('weather day api'),
            fetch(weekWeatherUrl).then(res => res.json()), console.log('weather week api'),
            fetch('https://api.openai.com/v1/chat/completions', aiTextOptions).then(res => res.json()), console.log('openapi text'),
            fetch('https://api.openai.com/v1/chat/completions', aiJsonOptions).then(res => res.json()), console.log('openapi json'),
            fetch(geoapifyUrl).then(res => res.json()), console.log('boundaries api'),
        ]);

        console.log('All APIs fetched');

        // Save data in JSON object
        const responseData = {
            country: randomCountry,
            imageUrl: imageResponse.data,
            weather: weatherResponse,
            weatherWeek: weekWeatherResponse,
            aiData: aiTextResponse,
            aiJSON: aiJsonResponse,
            boundary: geoapifyResponse,
        };

        res.body = JSON.stringify(responseData);

    } catch (error) {
        console.error('Error fetching countries info:', error);
        res.statusCode = 500;
        res.body = JSON.stringify({ message: 'Internal Server Error' });
    }

    return res;
};