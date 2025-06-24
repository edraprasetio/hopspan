import '@emotion/react'
declare module '@emotion/react' {
    export interface Theme {
        primaryColor: {
            black: {
                1: string
            }
            green: {
                1: string
                2: string
            }
            white: {
                1: string
                2: string
            }
            grey: {
                1: string
                2: string
            }
            red: {
                1: string
            }
        }
        breakPoints: {
            tablet: string
            miniTablet: string
            largePhone: string
            phone: string
        }
    }
}
