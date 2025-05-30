import React from 'react'
import Main from './pages/Main'
import { ThemeProvider } from '@emotion/react'
import { defaultTheme } from './styles/theme'

function App() {
    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <div>
                    <Main />
                </div>
            </ThemeProvider>
        </>
    )
}

export default App
