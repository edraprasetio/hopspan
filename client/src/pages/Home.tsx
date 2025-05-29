import { useState } from 'react'
import { HomeBackground } from '../components/home/background'
import axios from 'axios'
import MapView from '../components/atoms/map'

type LocationInfo = {
    city: string
    country: string
    latitude: string
    longitude: string
}

type Result = {
    ip: string
    serverLocation: LocationInfo
    clientLocation: LocationInfo
    distance: string
}

export const Home = () => {
    const [domain, setDomain] = useState('')
    const [result, setResult] = useState<Result | null>(null)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setResult(null)

        try {
            const response = await axios.post('http://localhost:5000/api/lookup', { domain })
            setResult(response.data)
            console.log(response.data)
        } catch (err) {
            setError('Error fetching data. Make sure the domain is valid.')
        }
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
            <h1>Server Distance Checker</h1>
            <form onSubmit={handleSubmit}>
                <input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder='Enter domain (e.g. yahoo.com)' style={{ padding: '0.5rem', width: '300px' }} />
                <button type='submit' style={{ marginLeft: '1rem', padding: '0.5rem' }}>
                    Check
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {result && (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Results</h2>
                    <p>
                        <strong>Distance:</strong> {result.distance} km
                    </p>
                    <h3>Server Location</h3>
                    <p>
                        {result.serverLocation.city}, {result.serverLocation.country}
                    </p>
                    <h3>Your Location</h3>
                    <p>
                        {result.clientLocation.city}, {result.clientLocation.country}
                    </p>
                    <MapView
                        center={{
                            lat: parseFloat(result.clientLocation.latitude),
                            lng: parseFloat(result.clientLocation.longitude),
                            label: 'Your Location',
                        }}
                        markers={[
                            {
                                lat: parseFloat(result.clientLocation.latitude),
                                lng: parseFloat(result.clientLocation.longitude),
                                label: 'Your Location',
                            },
                            {
                                lat: parseFloat(result.serverLocation.latitude),
                                lng: parseFloat(result.serverLocation.longitude),
                                label: 'Server Location',
                            },
                        ]}
                    />
                </div>
            )}
        </div>
    )
}
