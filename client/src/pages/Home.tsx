import { useRef, useState } from 'react'
import { HeaderWrapper, HomeBackground, LocationHeader, SubCard, SubCardWrapper, TopRightImage } from '../components/home'
import { Card } from '../components/atoms/card'
import axios from 'axios'
import MapView from '../components/atoms/map'
import { Header16, Header20, Header24, Header32, Header40, Header64, Paragraph12, Paragraph14, Paragraph16 } from '../styles/typography'
import CustomInput from '../components/atoms/input'
import { GreenButton, WhiteButton } from '../components/atoms/button'
import loadingBlue from '../assets/icons/loading_blue.svg'
import hopSpanLogo from '../assets/icons/hopspan_logo1.1.png'
import leafImage from '../assets/images/leaf-1.png'

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
            <TopRightImage src={leafImage} />
            <HeaderWrapper>
                <div>
                    <Header64 style={{ textAlign: 'center' }}>TRACE YOUR SITE&rsquo;S</Header64>
                    <Header64 style={{ textAlign: 'center', color: '#53ab79' }}>DIGITAL FOOTPRINT</Header64>
                </div>
                <Header20 style={{ letterSpacing: '1px' }}>See how much CO₂ your website emits, how far your data travels, and where it&rsquo;s hosted.</Header20>
            </HeaderWrapper>
            <Card ref={inputRef}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', width: '100%' }}>
                    <CustomInput label='Website Link' value={domain} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)} placeholder='Enter domain (e.g. yahoo.com)' message={error} status={error ? 'error' : ''} />
                    <GreenButton type='submit' style={{ width: '200px' }}>
                        {loading ? <img src={loadingBlue} style={{ height: '24px' }} /> : <Paragraph16>CALCULATE</Paragraph16>}
                    </GreenButton>
                </form>

                <Paragraph14 style={{ textAlign: 'center', color: '#67687b' }}>
                    <span style={{ color: '#ff8383' }}>*</span>By using HopSpan, you agree that the domain you submit may be processed and stored for analytical and educational purposes.
                </Paragraph14>
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
