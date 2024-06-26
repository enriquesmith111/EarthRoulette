import { useEffect, useState } from "react";

export default function SearchButton({ info, loading }) {
    const country = info?.country
    const loadingClass = loading ? 'loading disabled' : '';
    const [countryCode, setCountryCode] = useState();

    useEffect(() => {
        const fetchCode = async () => {

            if (!country || !country.capital) return;

            if (info?.weather.sys) {
                setCountryCode(info?.weather.sys.country);
            }
        }
        fetchCode();
    }, [country, info])

    const handleSearchClick = () => {
        window.open(`https://www.skyscanner.net/flights-to/${countryCode}`, "_blank");
    };

    return (
        <>
            <button className={`${loadingClass}`} onClick={handleSearchClick}>Search Flight</button>
        </>
    )
}