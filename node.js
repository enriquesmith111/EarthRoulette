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
        const randomCountry = countries[randomIndex];
        const imageUrl = `https://api.unsplash.com/search/photos?query=${randomCountry?.name?.common}&random&client_id=${apiKey}`

        const responseData = {
            country: randomCountry,
            imageUrl,
        };

        res.json(responseData);

    } catch (error) {
        console.error('Error fetching countries:', error);
    }


    // const imageUrl = `https://api.unsplash.com/search/photos?query=${randomCountry?.data?.name?.common}&random&client_id=${apiKey}`

    // const unsplashData = response.data.results[Math.floor(Math.random() * 10)].urls.regular;
});

app.get('/image', async (req, res) => {

})

app.listen(8000, () => console.log(`server is running on ${PORT}`))