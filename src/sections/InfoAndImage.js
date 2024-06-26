import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import BoardingPass from '../components/Animation Boarding Pass.json'


export default function InfoAndImage({ info, loading }) {
    return (
        <div className='info-and-image'>
            <CountryInfo info={info} loading={loading} />
            <CountryImage info={info} loading={loading} />
        </div>
    )
}

function CountryInfo({ info, loading }) {

    const country = info?.country
    const loadingClass = loading ? 'loading' : '';

    return (
        <div className='country-info' >
            {country ? (
                <>
                    {<img className={`${loadingClass}`} src={country?.flags.svg} alt={`Flag of ${country?.flags.alt}
                    }`}></img>}
                    {<h4 className={`${loadingClass}`}>{country?.name?.common}</h4>}
                    {/* {<h4>{country?.subregion}</h4>} */}
                    {<h4 className={`${loadingClass}`}>{country?.subregion}</h4>}
                </>
            ) : (
                <h4 className={`${loadingClass}`}>Press Spin for a random country</h4>
            )}
        </div>
    )
}


function CountryImage({ info, loading }) {
    const country = info?.country
    const [imageUrl, setImageUrl] = useState(null);
    const [images, setImages] = useState([]);
    const [imageIndex, setImageIndex] = useState(0); // Track current image index
    const loadingClass = loading ? 'loading disabled' : '';


    useEffect(() => {
        const fetchRandomCountryImage = async () => {
            if (!country) return; // Don't fetch if country is not available
            const fetchedImages = info?.imageUrl.map(
                (result) => result.urls.regular
            );
            setImages(fetchedImages); // Store all fetched image URLs

            // Set initial image URL (if any)
            if (fetchedImages.length > 0) {
                setImageUrl(fetchedImages[0]);
            }
        };

        fetchRandomCountryImage();
    }, [country, info]);

    const handleImageClickRight = () => {
        // Handle potential edge cases (no images or last image reached)
        if (images.length === 0) {
            console.error('No images available for this country');
            return;
        }

        const nextIndex = (imageIndex + 1) % images.length; // Wrap around if at last image
        setImageIndex(nextIndex);
        setImageUrl(images[nextIndex]);
    };

    const handleImageClickLeft = () => {
        // Handle potential edge cases (no images or last image reached)
        if (images.length === 0) {
            console.error('No images available for this country');
            return;
        }

        const nextIndex = (imageIndex === 0 ? images.length - 1 : imageIndex - 1) % images.length;
        setImageIndex(nextIndex);
        setImageUrl(images[nextIndex]);
    };

    return (
        <div className={`country-image`}>
            {imageUrl ? (
                <>
                    <img src={imageUrl} alt="Random Country" />
                    <button className={`image-change-btn-right ${loadingClass}`}>
                        <i onClick={handleImageClickRight} class="fa-solid fa-angles-right"></i>
                    </button>
                    <button className={`image-change-btn-left ${loadingClass}`}>
                        <i onClick={handleImageClickLeft} class="fa-solid fa-angles-left"></i>
                    </button>
                </>
            ) : (
                <Lottie
                    className={`boarding-pass ${loadingClass}`}
                    animationData={BoardingPass}
                    speed={0.5}
                />
            )}
        </div>
    );
}