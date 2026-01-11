import { Container, Box, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { ProcessDetail } from '../components/ProcessDetail';

export const ProcessDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography>Processo não encontrado</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={3}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/processos')}
                    sx={{ mb: 2 }}
                >
                    Voltar para listagem
                </Button>
            </Box>
            <ProcessDetail id={id} />
        </Container>
    );
};
