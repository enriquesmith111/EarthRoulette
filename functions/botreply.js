const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors());

exports.handler = async (event, context) => {
    const req = JSON.parse(event.body);; // Access the request object from the event
    const res = {
        statusCode: 200, // Set default status code
        headers: {
            'Content-Type': 'application/json', // Set default content type
            'Access-Control-Allow-Origin': '*',
        },
        body: '',
    };

    try {
        const message = req.body.message;
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
                messages: [{
                    role: "system",
                    content: `You provide any travel tips and information about i might need for a specific country`,
                },
                { role: "user", content: `${message}` },
                ],
                max_tokens: 180,
            }),
        };
        console.log(message)

        const response = await fetch('https://api.openai.com/v1/chat/completions', openAIRequest).then(res => res.json());
        res.body = JSON.stringify(response);

    } catch (error) {
        console.error('Error fetching countries info:', error);
        res.statusCode = 500;
        res.body = JSON.stringify({ message: 'Internal Server Error' });
    }

    return res;
};