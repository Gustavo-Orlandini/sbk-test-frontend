import { Box, Typography } from '@mui/material';
import { Inbox } from '@mui/icons-material';

interface EmptyStateProps {
    message: string;
    description?: string;
}

export const EmptyState = ({ message, description }: EmptyStateProps) => {
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
            <Inbox sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary">
                {message}
            </Typography>
            {description && (
                <Typography variant="body2" color="text.secondary" textAlign="center">
                    {description}
                </Typography>
            )}
        </Box>
    );
};
