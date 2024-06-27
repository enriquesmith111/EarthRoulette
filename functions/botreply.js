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
        // OpenAI request options
        const openAIRequest = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: "system",
                    content: `You provide any travel tips and information about Spain `,
                },
                { role: "user", content: `best restaurants` },
                ],
                max_tokens: 180,
            }),
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', openAIRequest).then(res => res.json());
        res.body = JSON.stringify(response);

    } catch (error) {
        console.error('Error fetching countries info:', error);
        res.statusCode = 500;
        res.body = JSON.stringify({ message: 'Internal Server Error' });
    }

    return res;
};