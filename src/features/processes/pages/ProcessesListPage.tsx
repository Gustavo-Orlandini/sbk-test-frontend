import { Container, Typography, Box } from '@mui/material';
import { ProcessesList } from '../components/ProcessesList';

export const ProcessesListPage = () => {
    return (
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
    );
};
