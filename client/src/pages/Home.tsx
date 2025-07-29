import { useRef, useState } from 'react'
import {
    HeaderWrapper,
    HomeBackground,
    LocationHeader,
    TopRightImage,
} from '../components/home'
import { Card, CardsContainer } from '../components/atoms/card'
import axios from 'axios'
import MapView from '../components/atoms/map'
import {
    Header16,
    Header20,
    Header64,
    Paragraph14,
    Paragraph16,
} from '../styles/typography'
import CustomInput from '../components/atoms/input'
import { GreenButton } from '../components/atoms/button'

import leafImage from '../assets/images/leaf-1.png'
import { Fade } from 'react-awesome-reveal'
import { Bars } from '@agney/react-loading'
import BandwidthSlider from '../components/atoms/slider'

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
    isGreen: boolean
    carbonAmount: number
    serverLocation: LocationInfo
    clientLocation: LocationInfo
    distance: string
    latency: number
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
    const [bandwidth, setBandwidth] = useState(100)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!domain.trim()) {
            setError('Please enter a domain name')
            return
        }

        setError('')
        setResult(null)
        setLoading(true)
        setDomain('')

        const t0 = performance.now()
        const timerId = setInterval(() => {
            // const elapsed = (performance.now() - t0).toFixed(0)
            // // console.log(`⏱  ${elapsed} ms`)
        }, 100)

        try {
            const response = await axios.post(
                'http://localhost:5000/api/lookup',
                { domain, bandwidth }
            )
            setResult(response.data)
            console.log(response.data)
            setTimeout(() => {
                const element = resultRef.current
                if (element) {
                    const yOffset = -50
                    const y = element.getBoundingClientRect().top + yOffset

                    window.scrollTo({ top: y, behavior: 'smooth' })
                }
            }, 100)
        } catch (err) {
            setError('Error fetching data. Make sure the domain is valid.')
        } finally {
            setLoading(false)
            clearInterval(timerId)
            const total = (performance.now() - t0).toFixed(0)
            console.log(`Finished in ${total} ms`)
        }
    }

    const handleScanAnother = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <HomeBackground>
            <TopRightImage src={leafImage} />
            <HeaderWrapper style={{ marginTop: '64px' }}>
                <div>
                    <Header64 style={{ textAlign: 'center' }}>
                        TRACE YOUR SITE&rsquo;S
                    </Header64>
                    <Header64 style={{ textAlign: 'center', color: '#53ab79' }}>
                        LATENCY PROFILE
                    </Header64>
                </div>
                <Header20 style={{ letterSpacing: '1px' }}>
                    See how far your data travels, how fast it moves, and where
                    your server lives.
                </Header20>
            </HeaderWrapper>
            <CardsContainer>
                <Card ref={inputRef} style={{ marginBottom: '64px' }}>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '32px',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <CustomInput
                            label='Website Link'
                            value={domain}
                            data-testid='url-input'
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setDomain(e.target.value)}
                            placeholder='Enter domain (e.g. yahoo.com)'
                            message={error}
                            status={error ? 'error' : ''}
                        />
                        <BandwidthSlider
                            bandwidth={bandwidth}
                            setBandwidth={setBandwidth}
                        />
                        <GreenButton
                            type='submit'
                            style={{ width: '200px' }}
                            data-testid='calculate-button'
                        >
                            {loading ? (
                                <div style={{ width: 24, height: 20 }}>
                                    <Bars />
                                </div>
                            ) : (
                                <Paragraph16>CALCULATE</Paragraph16>
                            )}
                        </GreenButton>
                    </form>

                    <Paragraph14
                        style={{ textAlign: 'center', color: '#67687b' }}
                    >
                        <span style={{ color: '#ff8383' }}>*</span>By using
                        HopSpan, you agree that the domain you submit may be
                        processed and stored for analytical and educational
                        purposes.
                    </Paragraph14>
                </Card>
            </CardsContainer>
            {result && (
                <div ref={resultRef}>
                    <Fade direction='up' triggerOnce>
                        <CardsContainer>
                            <Card>
                                <Header16 style={{ color: '#0a0a0a' }}>
                                    We&rsquo;ve checked{' '}
                                    <span
                                        style={{
                                            color: '#53ab79',
                                            fontWeight: 700,
                                            fontSize: '20px',
                                        }}
                                    >
                                        {result.domainToLookUp}
                                    </span>
                                    , and this is what we found:
                                </Header16>
                            </Card>

                            <Card>
                                <Header16 style={{ color: '#0a0a0a' }}>
                                    {result.latency < 200 ? (
                                        <>
                                            The connection latency is{' '}
                                            <span
                                                style={{
                                                    color: '#53ab79',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.latency} ms
                                            </span>
                                            , which is considered low and
                                            supports fast, responsive
                                            communication.
                                        </>
                                    ) : (
                                        <>
                                            The connection latency is{' '}
                                            <span
                                                style={{
                                                    color: '#ff8383',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.latency} ms
                                            </span>
                                            , which is relatively high and may
                                            result in slower page loads or
                                            delays in data transfer.
                                        </>
                                    )}
                                </Header16>
                            </Card>

                            {/* <Card>
                                <Header16 style={{ color: '#0a0a0a' }}>
                                    {result.carbonAmount < 1 ? (
                                        <>
                                            Nice! This page emits only{' '}
                                            <span
                                                style={{
                                                    color: '#53ab79',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.carbonAmount.toFixed(3)}{' '}
                                                grams
                                            </span>{' '}
                                            of CO₂ per visit. That’s pretty
                                            efficient!
                                        </>
                                    ) : (
                                        <>
                                            This page emits{' '}
                                            <span
                                                style={{
                                                    color: '#ff8383',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.carbonAmount.toFixed(3)}{' '}
                                                grams
                                            </span>{' '}
                                            of CO₂ per visit, which is
                                            relatively high and could be
                                            optimized.
                                        </>
                                    )}
                                </Header16>
                            </Card> */}

                            <Card>
                                <Header16 style={{ color: '#0a0a0a' }}>
                                    {Number(result.websiteSize) < 2100000 ? (
                                        <>
                                            With just{' '}
                                            <span
                                                style={{
                                                    color: '#53ab79',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.websiteSize
                                                    ? formatBytes(
                                                          Number(
                                                              result.websiteSize
                                                          )
                                                      )
                                                    : 'Unavailable'}
                                            </span>{' '}
                                            of page weight, this site loads fast
                                            and light.
                                        </>
                                    ) : (
                                        <>
                                            At{' '}
                                            <span
                                                style={{
                                                    color: '#ff8383',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.websiteSize
                                                    ? formatBytes(
                                                          Number(
                                                              result.websiteSize
                                                          )
                                                      )
                                                    : 'Unavailable'}
                                            </span>
                                            , this page is heavier than average
                                            and may impact load speed and
                                            emissions.
                                        </>
                                    )}
                                </Header16>
                            </Card>

                            <Card>
                                <Header16 style={{ color: '#0a0a0a' }}>
                                    {result.isGreen === true ? (
                                        <>
                                            Awesome! This website is{' '}
                                            <span
                                                style={{
                                                    color: '#53ab79',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                Green Hosted
                                            </span>{' '}
                                            and runs on renewable energy.
                                        </>
                                    ) : (
                                        <>
                                            Unfortunately, This website is{' '}
                                            <span
                                                style={{
                                                    color: '#ff8383',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                Not Green Hosted
                                            </span>{' '}
                                            and runs on fossil fuel.
                                        </>
                                    )}
                                </Header16>
                            </Card>

                            <Card>
                                <Header16 style={{ color: '#0a0a0a' }}>
                                    {Number(result.distance) < 1500 ? (
                                        <>
                                            The server is just{' '}
                                            <span
                                                style={{
                                                    color: '#53ab79',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.distance} km
                                            </span>{' '}
                                            away from you. Great for fast,
                                            efficient access.
                                        </>
                                    ) : (
                                        <>
                                            The server is located{' '}
                                            <span
                                                style={{
                                                    color: '#ff8383',
                                                    fontWeight: 700,
                                                    fontSize: '20px',
                                                }}
                                            >
                                                {result.distance} km
                                            </span>{' '}
                                            away from you, which may lead to
                                            slower response times and higher
                                            emissions.
                                        </>
                                    )}
                                </Header16>
                            </Card>

                            <Card style={{ gap: '16px' }}>
                                <LocationHeader>
                                    <Header20 style={{ color: '#0a0a0a' }}>
                                        Location
                                    </Header20>
                                    <Header20
                                        style={{
                                            color: '#53ab79',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {result.serverLocation.city},{' '}
                                        {result.serverLocation.country}
                                    </Header20>
                                </LocationHeader>
                                <MapView
                                    center={{
                                        lat: parseFloat(
                                            result.clientLocation.latitude
                                        ),
                                        lng: parseFloat(
                                            result.clientLocation.longitude
                                        ),
                                        label: 'Your Location',
                                    }}
                                    markers={[
                                        {
                                            lat: parseFloat(
                                                result.clientLocation.latitude
                                            ),
                                            lng: parseFloat(
                                                result.clientLocation.longitude
                                            ),
                                            label: 'Your Location',
                                        },
                                        {
                                            lat: parseFloat(
                                                result.serverLocation.latitude
                                            ),
                                            lng: parseFloat(
                                                result.serverLocation.longitude
                                            ),
                                            label: 'Server Location',
                                        },
                                    ]}
                                />
                            </Card>

                            <GreenButton
                                type='submit'
                                style={{
                                    width: '328px',
                                    marginBottom: '64px',
                                    marginTop: '16px',
                                }}
                                onClick={handleScanAnother}
                            >
                                <Header16>CALCULATE ANOTHER SITE</Header16>
                            </GreenButton>
                        </CardsContainer>
                    </Fade>
                </div>
            )}
        </HomeBackground>
    )
}
