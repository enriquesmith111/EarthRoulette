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
        console.log('Countries API');

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
                messages: [{ role: 'user', content: `give a paragraph of some general facts about ${randomCountry?.name?.common}` }],
                max_tokens: 180,
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
                    content: `You provide a JSON object of up to 7 best cities or places to visit in a country following this format: 
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
            // Measure image API call time
            (async () => {
                const startTime = performance.now();
                const response = await axios.get(imageUrl);
                const unsplashData = response.data.results;
                const endTime = performance.now();
                console.log(`Image API: ${(endTime - startTime).toFixed(2)}ms`);
                return unsplashData;
            })(),

            // Measure weather day API call time
            (async () => {
                const startTime = performance.now();
                const response = await fetch(weatherUrl).then(res => res.json());
                const endTime = performance.now();
                console.log(`Weather day API: ${(endTime - startTime).toFixed(2)}ms`);
                return response;
            })(),

            // Measure weather week API call time
            (async () => {
                const startTime = performance.now();
                const response = await fetch(weekWeatherUrl).then(res => res.json());
                const endTime = performance.now();
                console.log(`Weather week API: ${(endTime - startTime).toFixed(2)}ms`);
                return response;
            })(),

            // Measure OpenAI text API call time
            (async () => {
                const startTime = performance.now();
                const response = await fetch('https://api.openai.com/v1/chat/completions', aiTextOptions).then(res => res.json());
                const endTime = performance.now();
                console.log(`OpenAI Text API: ${(endTime - startTime).toFixed(2)}ms`);
                return response;
            })(),

            // Measure OpenAI JSON API call time
            (async () => {
                const startTime = performance.now();
                const response = await fetch('https://api.openai.com/v1/chat/completions', aiJsonOptions).then(res => res.json());
                const endTime = performance.now();
                console.log(`OpenAI JSON API: ${(endTime - startTime).toFixed(2)}ms`);
                return response;
            })(),

            // Measure Geoapify API call time
            (async () => {
                const startTime = performance.now();
                const response = await fetch(geoapifyUrl).then(res => res.json());
                const endTime = performance.now();
                console.log(`Geoapify API: ${(endTime - startTime).toFixed(2)}ms`);
                return response;
            })(),
        ]);

        console.log('All APIs fetched');

        // Save data in JSON object
        const responseData = {
            country: randomCountry,
            imageUrl: imageResponse,
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