import { useEffect, useState } from "react";

export default function CountryText({ info, loading }) {
    const country = info?.country
    const [time, setTime] = useState();
    const loadingClass = loading ? 'loading' : '';
    const aiText = info?.aiData?.choices?.length > 0 ? info?.aiData.choices[0].message.content : null;

    useEffect(() => {
        const fetchTime = async () => {
            if (!country || !country.capital) return;
            const timezoneOffset = info?.weather.timezone;
            const currCountryTime = Math.floor(Date.now() / 1000) + timezoneOffset;
            let myDate = new Date(currCountryTime * 1000);
            const formattedTime = myDate.toGMTString().slice(0, -4);
            setTime(formattedTime);
        };

        fetchTime();

    }, [country, info]);


    if (!country) return;
    const languages = Object.values(country?.languages)
        .slice(0, -1) // Get all elements except the last
        .join(', ') + // Join them with commas
        ' and ' + // Add 'and' before the last element
        Object.values(country?.languages).slice(-1);

    const capitals = Object.values(country?.capital)
        .slice(0, -1) // Get all elements except the last
        .join(', ') + // Join them with commas
        ' and ' + // Add 'and' before the last element
        Object.values(country?.languages).slice(-1);

    return (
        <div className={`country-text ${loadingClass}`}>
            <h1 className={`${loadingClass}`}>
                {country?.name.common}
            </h1>
            <p className={`${loadingClass}`}>
                {aiText?.error || aiText === null ? (
                    <>
                        {country?.name.common} also known as {country?.name.official}, a country located in {country?.continents}, more precisely {country?.subregion}, with a population of approximately {country?.population.toLocaleString()} people and it's capital being {country?.capital}. Cars in {country?.name.common} drive on the {country?.car.side} side of the road and the total area of the country is {country?.area.toLocaleString()} square kilometers. The currency used in {country?.name.common} is the {Object.values(country?.currencies)?.[0].name} {country?.currency}. {Object.values(country?.languages).length >= 2 ? `The common languages spoken in the country are ${languages}` : ` The common language spoken is ${Object.values(country?.languages)[0]}`}. People from {country?.name.common} are known as {Object.values(country?.demonyms)?.[0].m}. {Object.values(country?.capital).length >= 2 ? `The time and date in the many capital cities of ${capitals} ` : `The time and date in the capital city of ${Object.values(country?.capital)[0]}`} is {time}
                    </>
                ) : (
                    <>
                        {aiText}
                    </>
                )}
            </p>
        </div>
    )
}