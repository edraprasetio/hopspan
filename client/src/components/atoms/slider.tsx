import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

const marks = [
    { value: 0, label: '1 Mbps' },
    { value: 1, label: '10 Mbps' },
    { value: 2, label: '100 Mbps' },
    { value: 3, label: '1 Gbps' },
    { value: 4, label: '10 Gbps' },
]

function BandwidthSlider({
    bandwidth,
    setBandwidth,
}: {
    bandwidth: number
    setBandwidth: (value: number) => void
}) {
    // Convert actual Mbps to log scale (for value prop)
    const sliderValue = Math.log10(bandwidth)

    const handleChangeCommitted = (event: any, value: number | number[]) => {
        const logValue = typeof value === 'number' ? value : value[0]
        const actualMbps = Math.pow(10, logValue)
        setBandwidth(actualMbps)
    }

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                step={null}
                min={0}
                max={4}
                marks={marks}
                value={sliderValue}
                onChangeCommitted={handleChangeCommitted}
                valueLabelDisplay='auto'
                valueLabelFormat={(v) => `${Math.pow(10, v)} Mbps`}
            />
        </Box>
    )
}

export default BandwidthSlider
