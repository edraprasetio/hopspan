import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import customIconUrl from '../../assets/marker_blue3.svg'

const customIcon = L.icon({
    iconUrl: customIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
})

type Location = {
    lat: number
    lng: number
    label?: string
}

type MapProps = {
    center: Location
    markers?: Location[]
}

const MapView = ({ center, markers = [] }: MapProps) => {
    const polylinePositions = markers.length >= 2 ? (markers.map((marker) => [marker.lat, marker.lng]) as [number, number][]) : []

    return (
        <MapContainer center={[center.lat, center.lng]} zoom={4} style={{ height: '400px', width: '100%' }}>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
            {markers.map((marker, idx) => (
                <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
                    <Popup>{marker.label || `Marker ${idx + 1}`}</Popup>
                </Marker>
            ))}
            {polylinePositions.length >= 2 && (
                <Polyline
                    positions={polylinePositions}
                    pathOptions={{
                        color: '#1A73E8',
                        weight: 4,
                        dashArray: '0',
                        opacity: 0.7,
                    }}
                />
            )}
        </MapContainer>
    )
}

export default MapView
