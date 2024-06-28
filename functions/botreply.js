const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
// const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors());

exports.handler = async (event, context) => {
    const res = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: '',
    };

    try {
        console.log("Received event:", event);  // Log the received event
        const req = JSON.parse(event.body); // Parse the request body
        const message = req.message;
        console.log("Parsed message:", message);  // Log the parsed message

        if (!message) {
            throw new Error('Message not provided');
        }

        // OpenAI request options
        const openAIRequest = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: "system", content: `You provide any travel tips and information about i might need for a specific country` },
                    { role: "user", content: message },
                ],
                max_tokens: 180,
            }),
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', openAIRequest);
        const responseBody = await response.json();

        if (!response.ok) {
            throw new Error(`OpenAI API returned an error: ${response.status} ${response.statusText}`);
        }

        res.body = JSON.stringify(responseBody);
    } catch (error) {
        console.error('Error fetching country info:', error);
        res.statusCode = 500;
        res.body = JSON.stringify({ message: 'Internal Server Error', error: error.message });
    }

    return res;
};