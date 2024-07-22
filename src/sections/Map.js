import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'
import './styles/map.css'
import MapPin from '../components/map-pin.png'

export default function Map({ info, loading }) {
    const [polygonData, setPolygonData] = useState(null);
    const [markers, setMarkers] = useState([]);
    const boundaries = info?.boundary;
    const key = Date.now();

    const lat = info?.country?.latlng[0];
    const lng = info?.country?.latlng[1];


    useEffect(() => {
        if (info?.aiJSON) {
            const markers = info?.aiJSON?.choices[0]?.message?.content;
            // console.log(markers)
            const JSONMarker = JSON.parse(markers);
            setMarkers(JSONMarker);
        }
    }, [info?.aiJSON]);

    useEffect(() => {
        if (info?.boundary) {
            const boundaries = info?.boundary.features[info?.boundary.features.length - 1];
            setPolygonData({ ...boundaries });
        }
    }, [info?.boundary]);

    const OutlineColor = {
        stroke: true,
        color: "rgba(255, 0, 0, 0.8)",
        weight: 2,
        opacity: 0.7,
        fill: 'true',
        smoothFactor: 0.1,
        interactive: false,
    }

    const RecenterAutomatically = ({ lat, lng }) => {
        const map = useMap();
        const [initialZoom, setInitialZoom] = useState(4); // Store initial zoom state

        useEffect(() => {
            map.setView([lat, lng], initialZoom); // Set initial zoom on first render
            setInitialZoom(initialZoom); // Reset initialZoom on each update
        }, [lat, lng, map, initialZoom]); // Dependency array includes initialZoom for reset

        return null;
    };

    return (
        <div className={info ? 'map-container' : ''}>
            {polygonData && (
                <MapContainer center={[lat, lng]} zoom={4.5} scrollWheelZoom={false} style={{ height: '36rem', width: '100%' }}>
                    {(
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                    )}
                    <MarkerList markers={markers} />
                    <RecenterAutomatically lat={lat} lng={lng} />
                    {boundaries && <GeoJSON key={key} style={OutlineColor} data={polygonData} />}
                </MapContainer>
            )}
        </div>
    )
}

const MarkerList = ({ markers }) => {
    // console.log(markers)

    const customIcon = L.icon({
        iconUrl: MapPin, // Replace with your PNG path
        iconSize: [32, 32], // Adjust size as needed
        iconAnchor: [16, 32], // Anchor point for marker positioning
        popupAnchor: [-0, -32], // Offset for popup relative to marker
    });

    return markers?.locations.map((marker) => (
        <>
            {markers?.locations && (
                <Marker key={marker.latitude} position={[marker.latitude, marker.longitude]} icon={customIcon}>
                    <Popup>
                        <a href={`https://www.google.com/search?q=${marker.name}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <h1>{marker.name || marker.city || marker.place}</h1>
                        </a>
                        <p>{marker.description}</p>
                    </Popup>
                </Marker>
            )}
        </>
    ));
};