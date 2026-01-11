import { Container, Typography, Box, AppBar, Toolbar } from '@mui/material';
import { Gavel } from '@mui/icons-material';
import { ProcessesList } from '../components/ProcessesList';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useThemeMode } from '@/shared/contexts/ThemeContext';

export const ProcessesListPage = () => {
    const { mode, toggleMode } = useThemeMode();

    return (
        <>
            <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
                <Toolbar>
                    <Gavel sx={{ mr: 1.5 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Processos Jurídicos
                    </Typography>
                    <ThemeToggle mode={mode} onToggle={toggleMode} />
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box mb={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Processos Jurídicos
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Consulte e filtre processos jurídicos
                    </Typography>
                </Box>
                <ProcessesList />
            </Container>
        </>
    );
};
