import { useRef, useState } from 'react'
import { Card, HomeBackground, LocationHeader, SubCard, SubCardWrapper } from '../components/home'
import axios from 'axios'
import MapView from '../components/atoms/map'
import { Header16, Header20, Header24, Header32, Header40, Paragraph16 } from '../styles/typography'
import CustomInput from '../components/atoms/input'
import { WhiteButton } from '../components/atoms/button'
import loadingBlue from '../assets/icons/loading_blue.svg'
import hopSpanLogo from '../assets/icons/hopspan_logo1.1.png'

type LocationInfo = {
    city: string
    country: string
    latitude: string
    longitude: string
}

type Result = {
    ip: string
    websiteSize: string
    domainToLookUp: string
    serverLocation: LocationInfo
    clientLocation: LocationInfo
    distance: string
}

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const Home = () => {
    const [domain, setDomain] = useState('')
    const [result, setResult] = useState<Result | null>(null)
    const [error, setError] = useState('')
    const resultRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLDivElement | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!domain.trim()) {
            setError('Please enter a domain name')
            return
        }

        setError('')
        setDomain('')
        setResult(null)
        setLoading(true)

        try {
            const response = await axios.post('http://localhost:5000/api/lookup', { domain })
            setResult(response.data)
            console.log(response.data)
            setTimeout(() => {
                resultRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } catch (err) {
            setError('Error fetching data. Make sure the domain is valid.')
        } finally {
            setLoading(false)
        }
    }

    const handleScanAnother = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <HomeBackground>
            <Card ref={inputRef}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <img src={hopSpanLogo} style={{ height: '34px' }} />
                        <Header24 style={{ color: '#EFE5FF' }}>HopSpan</Header24>
                    </div>
                    <Header40 style={{ color: '#309BFF', textAlign: 'center' }}>How Far Does Your Data Travel?</Header40>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%' }}>
                    <CustomInput value={domain} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)} placeholder='Enter domain (e.g. yahoo.com)' message={error} status={error ? 'error' : ''} />
                    <WhiteButton type='submit' style={{ width: '200px' }}>
                        {loading ? <img src={loadingBlue} style={{ height: '24px' }} /> : <Header16>Analyze Site</Header16>}
                    </WhiteButton>
                </form>

                <Paragraph16 style={{ textAlign: 'center' }}>Ever wondered where a website is really hosted? HopSpan helps you visualize the server’s physical location, calculate its distance from you, and understand web performance fundamentals.</Paragraph16>
            </Card>
            {result && (
                <div ref={resultRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#B0B0BC', alignItems: 'center' }}>
                    <Card style={{ marginBottom: 'unset' }}>
                        <Header20>Results For</Header20>
                        <Header32 style={{ color: '#309BFF' }}>{result.domainToLookUp}</Header32>
                    </Card>

                    <SubCardWrapper>
                        <SubCard>
                            <Header20>Distance</Header20>
                            <Header32 style={{ color: '#309BFF' }}>{result.distance} km</Header32>
                        </SubCard>
                        <SubCard>
                            <Header20>Page Size</Header20>
                            <Header32 style={{ color: '#309BFF' }}>{result.websiteSize ? formatBytes(Number(result.websiteSize)) : 'Unavailable'}</Header32>
                        </SubCard>
                    </SubCardWrapper>
                    <LocationHeader>
                        <Header20>Location</Header20>
                        <Header20 style={{ color: '#309BFF' }}>
                            {result.serverLocation.city}, {result.serverLocation.country}
                        </Header20>
                    </LocationHeader>

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
                    <WhiteButton type='submit' style={{ width: '240px', marginBottom: '64px' }} onClick={handleScanAnother}>
                        <Header16>Analyze Another Site</Header16>
                    </WhiteButton>
                </div>
            )}
        </HomeBackground>
    )
}
