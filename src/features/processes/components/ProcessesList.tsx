import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Grid, Button, useTheme } from '@mui/material';
import { useThemeMode } from '@/shared/contexts/ThemeContext';
import { useProcesses } from '../hooks/useProcesses';
import { ProcessListItem } from './ProcessListItem';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ErrorState } from '@/shared/components/ErrorState';
import { EmptyState } from '@/shared/components/EmptyState';
import { ProcessesFilters, type SearchMode } from './ProcessesFilters';
import type { ProcessesListParams, ProcessListItem as ProcessListItemType } from '../types';
import { isCompleteProcessNumber, isValidProcessNumber } from '../utils/processNumberUtils';

const DEBOUNCE_DELAY = 800; // 800ms delay for search to reduce API calls

export const ProcessesList = () => {
    const [searchMode, setSearchMode] = useState<SearchMode>('simple');

    // Simple search state (local filtering)
    const [search, setSearch] = useState('');
    const [keywordSearch, setKeywordSearch] = useState('');
    const [searchError, setSearchError] = useState(false);

    // Advanced search state (API query params)
    const [advancedQuery, setAdvancedQuery] = useState('');
    const [advancedTribunal, setAdvancedTribunal] = useState('');
    const [advancedGrau, setAdvancedGrau] = useState<ProcessesListParams['grau'] | ''>('');

    // Shared state for simple mode filters (kept for backward compatibility)
    const [tribunal, setTribunal] = useState('');
    const [grau, setGrau] = useState<ProcessesListParams['grau'] | ''>('');

    const [filteredProcesses, setFilteredProcesses] = useState<ProcessListItemType[]>([]);

    const theme = useTheme();
    const { mode } = useThemeMode();
    const { processes, loading, error, hasMore, loadMore, refetch } = useProcesses();
    const searchTimeoutRef = useRef<number | null>(null);
    const isFirstRender = useRef(true);
    const refetchRef = useRef(refetch);

    // Keep refetch ref updated
    useEffect(() => {
        refetchRef.current = refetch;
    }, [refetch]);

    // Validate search input - only show error when number is complete
    useEffect(() => {
        if (search.trim()) {
            const isComplete = isCompleteProcessNumber(search);
            // Only show error if the number is complete but invalid
            setSearchError(isComplete && !isValidProcessNumber(search));
        } else {
            setSearchError(false);
        }
    }, [search]);

    /**
     * Filters processes by process number and/or keyword search
     */
    const filterProcesses = useCallback(
        (processList: ProcessListItemType[]): ProcessListItemType[] => {
            let filtered = processList;

            // Filter by process number if complete and valid
            if (isCompleteProcessNumber(search) && isValidProcessNumber(search)) {
                const searchNormalized = search.trim().toLowerCase();
                filtered = filtered.filter((process) =>
                    process.numero.toLowerCase().includes(searchNormalized)
                );
            }

            // Filter by keyword search (searches in multiple fields)
            if (keywordSearch.trim()) {
                const keywordNormalized = keywordSearch.trim().toLowerCase();
                filtered = filtered.filter((process) => {
                    // Search in multiple fields
                    const searchableText = [
                        process.numero,
                        process.tribunal,
                        process.classePrincipal,
                        process.assuntoPrincipal,
                        process.ultimoMovimento?.descricao || '',
                        process.grau,
                    ]
                        .join(' ')
                        .toLowerCase();

                    return searchableText.includes(keywordNormalized);
                });
            }

            return filtered;
        },
        [search, keywordSearch]
    );

    // Filter processes locally when search or keyword changes (only for simple mode)
    useEffect(() => {
        if (searchMode === 'simple') {
            const filtered = filterProcesses(processes);
            setFilteredProcesses(filtered);
        } else {
            // Advanced mode: use API results directly (no local filtering)
            setFilteredProcesses(processes);
        }
    }, [searchMode, search, keywordSearch, processes, filterProcesses]);

    // Extract unique tribunals from loaded processes
    const availableTribunals = Array.from(
        new Set(processes.map((process) => process.tribunal).filter(Boolean))
    ).sort();

    // Border color based on theme
    const activeBorderColor = mode === 'dark' ? '#FFD700' : theme.palette.primary.main; // Gold for dark, blue for light

    // Debounced filters effect (only for simple mode)
    useEffect(() => {
        // Skip first render to avoid duplicate initial fetch
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Only apply debounced search for simple mode
        if (searchMode !== 'simple') {
            return;
        }

        // Don't make API call if search is invalid
        if (searchError) {
            return;
        }

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for filters (simple mode only)
        searchTimeoutRef.current = setTimeout(() => {
            const params: ProcessesListParams = {};

            // Simple mode: only tribunal and grau (no q parameter)
            if (tribunal && tribunal.trim() !== '') {
                params.tribunal = tribunal;
            }
            if (grau === 'PRIMEIRO' || grau === 'SEGUNDO') {
                params.grau = grau;
            }

            // Always call refetch (even with empty params to show all)
            refetchRef.current(params);
        }, DEBOUNCE_DELAY);

        // Cleanup on unmount
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchMode, tribunal, grau, searchError]);

    // Handler for advanced search button
    const handleAdvancedSearch = useCallback(() => {
        const params: ProcessesListParams = {};

        // Advanced mode: use API query params (q, tribunal, grau)
        if (advancedQuery && advancedQuery.trim() !== '') {
            params.q = advancedQuery.trim();
        }
        if (advancedTribunal && advancedTribunal.trim() !== '') {
            params.tribunal = advancedTribunal;
        }
        if (advancedGrau === 'PRIMEIRO' || advancedGrau === 'SEGUNDO') {
            params.grau = advancedGrau;
        }

        // Call refetch immediately (no debounce)
        refetch(params);
    }, [advancedQuery, advancedTribunal, advancedGrau, refetch]);

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const handleClear = useCallback(() => {
        if (searchMode === 'simple') {
            setSearch('');
            setKeywordSearch('');
            setTribunal('');
            setGrau('');
        } else {
            setAdvancedQuery('');
            setAdvancedTribunal('');
            setAdvancedGrau('');
        }
        setSearchError(false);
        // Clear timeout and refetch immediately
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        refetch({});
    }, [refetch, searchMode]);

    const handleClearAndRetry = useCallback(() => {
        if (searchMode === 'simple') {
            setSearch('');
            setKeywordSearch('');
            setTribunal('');
            setGrau('');
        } else {
            setAdvancedQuery('');
            setAdvancedTribunal('');
            setAdvancedGrau('');
        }
        setSearchError(false);
        // Clear timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        // Retry with empty params
        refetch({});
    }, [refetch, searchMode]);

    const handleSearchModeChange = useCallback(
        (newMode: SearchMode) => {
            setSearchMode(newMode);
            // Clear filters when switching modes
            if (newMode === 'simple') {
                setAdvancedQuery('');
                setAdvancedTribunal('');
                setAdvancedGrau('');
            } else {
                setSearch('');
                setKeywordSearch('');
                setTribunal('');
                setGrau('');
            }
            // Reset and refetch
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            refetch({});
        },
        [refetch]
    );

    // Early returns must come AFTER all hooks and callbacks
    if (loading && processes.length === 0) {
        return <LoadingSpinner message="Carregando processos..." />;
    }

    if (error) {
        return (
            <ErrorState
                message={error.message}
                onRetry={() => refetch({})}
                onClearFilters={handleClearAndRetry}
            />
        );
    }

    return (
        <Box>
            <ProcessesFilters
                searchMode={searchMode}
                onSearchModeChange={handleSearchModeChange}
                keywordSearch={keywordSearch}
                onKeywordSearchChange={setKeywordSearch}
                search={search}
                onSearchChange={handleSearchChange}
                searchError={searchError}
                tribunal={tribunal}
                onTribunalChange={setTribunal}
                grau={grau}
                onGrauChange={setGrau}
                advancedQuery={advancedQuery}
                onAdvancedQueryChange={setAdvancedQuery}
                advancedTribunal={advancedTribunal}
                onAdvancedTribunalChange={setAdvancedTribunal}
                advancedGrau={advancedGrau}
                onAdvancedGrauChange={setAdvancedGrau}
                onClear={handleClear}
                onAdvancedSearch={handleAdvancedSearch}
                availableTribunals={availableTribunals}
                loading={loading}
                activeBorderColor={activeBorderColor}
            />

            {filteredProcesses.length === 0 && !loading ? (
                <EmptyState
                    message={
                        isCompleteProcessNumber(search) && isValidProcessNumber(search)
                            ? 'Nenhum processo encontrado com este número'
                            : keywordSearch.trim()
                                ? 'Nenhum processo encontrado com estas palavras-chave'
                                : 'Nenhum processo encontrado'
                    }
                    description="Tente ajustar os filtros de busca"
                />
            ) : (
                <>
                    <Grid container spacing={3}>
                        {filteredProcesses.map((process) => (
                            <Grid item xs={12} key={process.id}>
                                <ProcessListItem process={process} />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Only show "Load more" if not filtering by search or keyword (simple mode) or if in advanced mode */}
                    {hasMore && (searchMode === 'advanced' || (!isCompleteProcessNumber(search) && !keywordSearch.trim())) && (
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
