Earth Roulette: Random Destination Picker (React & Serverless Node.js) <br>
This project is a React web application with a serverless Node.js backend designed to help users discover their next travel destination in a fun and spontaneous way.

Features:

Random Country Selection: Users spin the roulette to be surprised by a random country or territory from a list of over 250 different regions. <br>
Immersive Experience: A beautiful carousel of images from the Unsplash API showcases the chosen country's landscapes and culture. <br>
Weather Information: Provides current and weekly weather forecasts for the capital city, allowing users to pack accordingly.
OpenAI Insights: Leveraging the OpenAI API, Earth Roulette generates a descriptive summary of the country, including interesting facts and recommended activities for visitors. <br>
Seamless Flight Booking: Integrated with the Skyscanner API, users can easily search and potentially book flights to their chosen destination with just a few clicks. <br>
Backend (Serverless Node.js): <br>

The serverless Node.js backend acts as a central hub for fetching data from various APIs and packages them into a JSON for the front-end to fetch each time the User spins for a random Country. <br>
It utilizes serverless functions to handle API requests efficiently and securely.

APIs Used:

RestfulCountries API: Provides basic information and random country selection. <br>
Unsplash API: Delivers captivating images of the chosen country. <br>
OpenWeather API: Retrieves current and weekly weather data for the country's capital. <br>
OpenAI API: Generates a descriptive summary with facts and travel recommendations. <br>
Skyscanner API: Enables users to search for and potentially book flights. <br>
This project utilizes modern React for a dynamic and user-friendly frontend experience. <br>
