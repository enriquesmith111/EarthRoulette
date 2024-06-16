const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config()


const app = express();

app.use(cors())

app.get('/info', async (req, res) => {
    const apiKey = `${process.env.REACT_APP_UNSPLASH_API_KEY}`;

    try {

        // Attempt to fetch random country from live API
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;
        const randomIndex = Math.floor(Math.random() * countries.length);

        // Attempt to fetch random country image
        const randomCountry = countries[randomIndex];
        const imageUrl = `https://api.unsplash.com/search/photos?query=${randomCountry?.name?.common}&random&client_id=${apiKey}`

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

        // save data in json object
        const responseData = {
            country: randomCountry,
            imageUrl,
            weather: weatherResults,
            weatherWeek: resultsWeek,
        };

        res.json(responseData);

    } catch (error) {
        console.error('Error fetching countries info:', error);
    }

});


app.listen(8000, () => console.log(`server is running on ${PORT}`))