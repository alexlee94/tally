import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ProductsPage from './pages/ProductsPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a1a1a',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ProductsPage />
        </ThemeProvider>
    );
};

export default App;
