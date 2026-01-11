import { useState, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Grid,
    Stack,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useProcesses } from '../hooks/useProcesses';
import { ProcessListItem } from './ProcessListItem';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import type { ProcessesListParams } from '../types';

const GRAU_OPTIONS = [
    { value: '', label: 'Todos' },
    { value: 'PRIMEIRO', label: 'Primeiro Grau' },
    { value: 'SEGUNDO', label: 'Segundo Grau' },
];

export const ProcessesList = () => {
    const [search, setSearch] = useState('');
    const [tribunal, setTribunal] = useState('');
    const [grau, setGrau] = useState<ProcessesListParams['grau'] | ''>('');

    const { processes, loading, error, hasMore, loadMore, refetch } = useProcesses();

    const handleSearch = useCallback(() => {
        refetch({
            search: search || undefined,
            tribunal: tribunal || undefined,
            grau: grau || undefined,
        });
    }, [search, tribunal, grau, refetch]);

    const handleClear = useCallback(() => {
        setSearch('');
        setTribunal('');
        setGrau('');
        refetch({});
    }, [refetch]);

    if (loading && processes.length === 0) {
        return <LoadingSpinner message="Carregando processos..." />;
    }

    if (error) {
        return <ErrorState message={error.message} onRetry={() => refetch()} />;
    }

    return (
        <Box>
            <Stack spacing={3} mb={4}>
                <Box>
                    <TextField
                        fullWidth
                        label="Buscar processos"
                        placeholder="Digite o número do processo, classe, assunto..."
                        value={search}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                        InputProps={{
                            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Tribunal</InputLabel>
                            <Select
                                value={tribunal}
                                label="Tribunal"
                                onChange={(e: SelectChangeEvent<string>) => setTribunal(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {/* Tribunais serão carregados dinamicamente da API quando disponível */}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Grau</InputLabel>
                            <Select
                                value={grau}
                                label="Grau"
                                onChange={(e: SelectChangeEvent<string>) => setGrau(e.target.value as ProcessesListParams['grau'] | '')}
                            >
                                {GRAU_OPTIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Box display="flex" gap={2}>
                    <Button variant="contained" onClick={handleSearch}>
                        Buscar
                    </Button>
                    <Button variant="outlined" onClick={handleClear}>
                        Limpar
                    </Button>
                </Box>
            </Stack>

            {processes.length === 0 && !loading ? (
                <EmptyState
                    message="Nenhum processo encontrado"
                    description="Tente ajustar os filtros de busca"
                />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {processes.map((process) => (
                            <Grid item xs={12} key={process.id}>
                                <ProcessListItem process={process} />
                            </Grid>
                        ))}
                    </Grid>

                    {hasMore && (
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                variant="outlined"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                {loading ? 'Carregando...' : 'Carregar mais'}
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};
