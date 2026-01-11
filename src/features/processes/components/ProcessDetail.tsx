import { Box, Typography, Paper, Divider, Chip, Grid } from '@mui/material';
import { useProcess } from '../hooks/useProcess';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorState } from '@/shared/components/ErrorState';

interface ProcessDetailProps {
    id: string; // caseNumber from route
}

export const ProcessDetail = ({ id }: ProcessDetailProps) => {
    // id is actually the caseNumber (numero do processo)
    const { process, loading, error, refetch } = useProcess(id);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return <LoadingSpinner message="Carregando detalhes do processo..." />;
    }

    if (error) {
        return <ErrorState message={error.message} onRetry={refetch} />;
    }

    if (!process) {
        return null;
    }

    const partesAtivas = process.partes?.filter((p) => p.tipo === 'ATIVO') || [];
    const partesPassivas = process.partes?.filter((p) => p.tipo === 'PASSIVO') || [];
    const ultimoMovimento = process.movimentos && process.movimentos.length > 0
        ? process.movimentos[process.movimentos.length - 1]
        : process.ultimoMovimento;

    return (
        <Box>
            {/* Cabeçalho do Processo */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h5" component="h1" fontWeight="bold">
                        {process.numero}
                    </Typography>
                    <Chip
                        label={process.grau}
                        color={process.grau === 'PRIMEIRO' ? 'primary' : 'secondary'}
                    />
                </Box>

                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                            Tribunal
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {process.tribunal}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary">
                            Classe Principal
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {process.classePrincipal}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                            Assunto Principal
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {process.assuntoPrincipal}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Último Movimento - Destaque */}
            {ultimoMovimento && (
                <Paper
                    elevation={3}
                    sx={(theme) => ({
                        p: 3,
                        mb: 3,
                        backgroundColor: theme.palette.mode === 'dark'
                            ? theme.palette.primary.dark
                            : theme.palette.primary.light,
                        color: theme.palette.mode === 'dark'
                            ? theme.palette.primary.contrastText
                            : theme.palette.getContrastText(theme.palette.primary.light),
                    })}
                >
                    <Typography variant="overline" display="block" mb={1}>
                        ÚLTIMO MOVIMENTO
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        {ultimoMovimento.descricao}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {formatDate(ultimoMovimento.data)} • Tipo: {ultimoMovimento.tipo}
                    </Typography>
                </Paper>
            )}

            {/* Partes - Polo Ativo */}
            {partesAtivas.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Polo Ativo
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {partesAtivas.map((parte) => (
                            <Grid item xs={12} sm={6} key={parte.id}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'action.hover',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="body1" fontWeight="medium">
                                        {parte.nome}
                                    </Typography>
                                    {parte.documento && (
                                        <Typography variant="body2" color="text.secondary">
                                            {parte.documento}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {/* Partes - Polo Passivo */}
            {partesPassivas.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Polo Passivo
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        {partesPassivas.map((parte) => (
                            <Grid item xs={12} sm={6} key={parte.id}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: 'action.hover',
                                        borderRadius: 1,
                                    }}
                                >
                                    <Typography variant="body1" fontWeight="medium">
                                        {parte.nome}
                                    </Typography>
                                    {parte.documento && (
                                        <Typography variant="body2" color="text.secondary">
                                            {parte.documento}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            )}

            {/* Tramitação Atual */}
            {process.tramitacaoAtual && (
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Tramitação Atual
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Local
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {process.tramitacaoAtual.local}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                                Status
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {process.tramitacaoAtual.status}
                            </Typography>
                        </Grid>
                        {process.tramitacaoAtual.data && (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    Data
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {formatDate(process.tramitacaoAtual.data)}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* Histórico de Movimentos */}
            {process.movimentos && Array.isArray(process.movimentos) && process.movimentos.length > 0 && (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Histórico de Movimentos
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box>
                        {process.movimentos.map((movimento, index) => (
                            <Box
                                key={movimento.id}
                                sx={{
                                    p: 2,
                                    mb: index < process.movimentos.length - 1 ? 2 : 0,
                                    backgroundColor: index === process.movimentos.length - 1 ? 'action.selected' : 'background.paper',
                                    borderLeft: index === process.movimentos.length - 1 ? 4 : 1,
                                    borderColor: index === process.movimentos.length - 1 ? 'primary.main' : 'divider',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {formatDate(movimento.data)}
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {movimento.descricao}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tipo: {movimento.tipo}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}
        </Box>
    );
};
