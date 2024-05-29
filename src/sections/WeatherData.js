import React, { useEffect, useState } from "react";

export default function DayNight({ country }) {
    const [temp, setTemp] = useState(null);
    const [isDaytime, setIsDaytime] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            if (!country || !country.capital) return;

            const location = country?.capital;
            const api = {
                key: '16842ae1a21473b7ab24bd137fd9b4b1',
                base: 'https://api.openweathermap.org/data/2.5/',
            };

            const response = await fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`);
            const results = await response.json();

            if (results.sys) {
                const sunrise = results.sys.sunrise + results.timezone;
                const sunset = results.sys.sunset + results.timezone;
                const timezoneOffset = results.timezone; // Time zone offset in seconds

                const currCountryTime = Math.floor(Date.now() / 1000) + timezoneOffset; // Current time in country's time zone
                console.log(results)
                console.log(sunrise, currCountryTime)

                const isDay = currCountryTime > sunrise && currCountryTime < sunset;
                setIsDaytime(isDay);
                console.log(isDay, country.capital)
                return { isDay, results }; // Update state based on daytime/nighttime calculation
            }

            setTemp(results);
        };

        fetchWeather(); // Call the function on component mount
    }, [country]);
}