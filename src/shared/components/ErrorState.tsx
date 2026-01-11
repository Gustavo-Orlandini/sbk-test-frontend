import { Box, Button, Typography, Alert } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
            gap={2}
            p={3}
        >
            <ErrorOutline color="error" sx={{ fontSize: 48 }} />
            <Alert severity="error" sx={{ width: '100%', maxWidth: 500 }}>
                <Typography variant="body1" fontWeight="medium">
                    Erro ao carregar dados
                </Typography>
                <Typography variant="body2" mt={1}>
                    {message}
                </Typography>
            </Alert>
            {onRetry && (
                <Button variant="contained" onClick={onRetry}>
                    Tentar novamente
                </Button>
            )}
        </Box>
    );
};
