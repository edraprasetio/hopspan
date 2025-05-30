import { useState } from 'react'
import { Card, HomeBackground } from '../components/home'
import axios from 'axios'
import MapView from '../components/atoms/map'
import { Header16, Header24, Header40, Paragraph16 } from '../styles/typography'
import CustomInput from '../components/atoms/input'
import { WhiteButton } from '../components/atoms/button'

type LocationInfo = {
    city: string
    country: string
    latitude: string
    longitude: string
}

type Result = {
    ip: string
    websiteSize: string
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
        <HomeBackground>
            <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <Header24 style={{ color: '#EFE5FF' }}>HopSpan</Header24>
                    <Header40 style={{ color: '#309BFF', textAlign: 'center' }}>Where in the World Is This Website?</Header40>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%' }}>
                    <CustomInput value={domain} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)} placeholder='Enter domain (e.g. yahoo.com)' />
                    <WhiteButton type='submit' style={{ width: '200px' }}>
                        <Header16>Analyze Site</Header16>
                    </WhiteButton>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Paragraph16 style={{ textAlign: 'center' }}>Ever wondered where a website is really hosted? This tool helps you visualize the server’s physical location, calculate its distance from you, and understand web performance fundamentals.</Paragraph16>

                {result && (
                    <div style={{ marginTop: '2rem' }}>
                        <Header24>Results</Header24>
                        <p>
                            <strong>Distance:</strong> {result.distance} km
                        </p>
                        <p>
                            <strong>Size:</strong> {result.websiteSize ? `${result.websiteSize} bytes` : 'Unavailable'}
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
            </Card>
        </HomeBackground>
    )
}
