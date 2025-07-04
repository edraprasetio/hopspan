import React from 'react'
import Main from './pages/Main'
import {
    ThemeProvider as MUIThemeProvider,
    createTheme,
} from '@mui/material/styles'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { defaultTheme } from './styles/theme'

function App() {
    const muiTheme = createTheme()
    return (
        <MUIThemeProvider theme={muiTheme}>
            <EmotionThemeProvider theme={defaultTheme}>
                <Main />
            </EmotionThemeProvider>
        </MUIThemeProvider>
    )
}

export default App
