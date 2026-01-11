import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './shared/theme';
import { ProcessesListPage } from './features/processes/pages/ProcessesListPage';
import { ProcessDetailPage } from './features/processes/pages/ProcessDetailPage';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/processos" replace />} />
                    <Route path="/processos" element={<ProcessesListPage />} />
                    <Route path="/processos/:id" element={<ProcessDetailPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
