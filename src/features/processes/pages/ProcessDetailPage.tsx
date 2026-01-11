import { Container, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Description } from '@mui/icons-material';
import { ProcessDetail } from '../components/ProcessDetail';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useThemeMode } from '@/shared/contexts/ThemeContext';

export const ProcessDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { mode, toggleMode } = useThemeMode();

    if (!id) {
        return (
            <>
                <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
                    <Toolbar>
                        <Description sx={{ mr: 1.5 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Processos Jurídicos
                        </Typography>
                        <ThemeToggle mode={mode} onToggle={toggleMode} />
                    </Toolbar>
                </AppBar>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography>Processo não encontrado</Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
                <Toolbar>
                    <Description sx={{ mr: 1.5 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Detalhe do Processo
                    </Typography>
                    <ThemeToggle mode={mode} onToggle={toggleMode} />
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box mb={3}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/processos')}
                    >
                        Voltar para listagem
                    </Button>
                </Box>
                <ProcessDetail id={id} />
            </Container>
        </>
    );
};
