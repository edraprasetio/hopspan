import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import customIconUrl from '../../assets/icons/marker_blue2.svg'
import styled from '@emotion/styled'
import { useEffect } from 'react'

const DarkMapWrapper = styled.div`
    .leaflet-layer,
    .leaflet-control-zoom-in,
    .leaflet-control-zoom-out,
    .leaflet-control-attribution {
        filter: none;
    }

    border-radius: 16px;
    overflow: hidden;
    width: 100%;
    margin-bottom: 16px;
    @media (max-width: ${(props) => props.theme.breakPoints.phone}) {
        margin-left: 16px;
        margin-right: 16px;
    }
`

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

const FitBounds = ({
    markers,
}: {
    markers: { lat: number; lng: number }[]
}) => {
    const map = useMap()

    useEffect(() => {
        if (markers.length >= 2) {
            const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]))
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [markers, map])

    return null
}

const MapView = ({ center, markers = [] }: MapProps) => {
    const polylinePositions =
        markers.length >= 2
            ? (markers.map((marker) => [marker.lat, marker.lng]) as [
                  number,
                  number
              ][])
            : []

    return (
        <DarkMapWrapper>
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={3.5}
                style={{ height: '400px', width: '100%' }}
            >
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                <FitBounds markers={markers} />

                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={[marker.lat, marker.lng]}
                        icon={customIcon}
                    >
                        <Popup>{marker.label || `Marker ${idx + 1}`}</Popup>
                    </Marker>
                ))}
                {polylinePositions.length >= 2 && (
                    <Polyline
                        positions={polylinePositions}
                        pathOptions={{
                            color: '#309BFF',
                            weight: 4,
                            dashArray: '0',
                            opacity: 0.7,
                        }}
                    />
                )}
            </MapContainer>
        </DarkMapWrapper>
    )
}

export default MapView
