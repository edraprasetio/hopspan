import { Theme } from '@emotion/react'

export const defaultTheme: Theme = {
    primaryColor: {
        black: {
            1: '#0a0a0a',
        },
        green: {
            1: '#53ab79',
            2: '#72d49c',
        },
        white: {
            1: '#ffffff',
            2: '#f5f6f8',
        },
        grey: {
            1: '#67687b',
            2: '#b0b0bc',
        },
        red: {
            1: '#ff8383',
        },
    },
    breakPoints: {
        tablet: '1420px',
        miniTablet: '1240px',
        largePhone: '940px',
        phone: '700px',
    },
}
