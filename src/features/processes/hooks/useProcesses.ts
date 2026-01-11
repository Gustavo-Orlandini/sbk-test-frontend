import { useState, useEffect, useCallback } from 'react';
import { processesApi } from '../api/processesApi';
import type { ApiError } from '@/shared/api/client';
import type { ProcessListItem, ProcessesListParams, ProcessesListResponse } from '../types';

interface UseProcessesReturn {
    processes: ProcessListItem[];
    loading: boolean;
    error: ApiError | null;
    hasMore: boolean;
    nextCursor?: string;
    loadMore: () => void;
    refetch: (params?: ProcessesListParams) => void;
    reset: () => void;
}

export const useProcesses = (initialParams?: ProcessesListParams): UseProcessesReturn => {
    const [processes, setProcesses] = useState<ProcessListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState<string | undefined>();
    const [currentParams, setCurrentParams] = useState<ProcessesListParams | undefined>(initialParams);
    const [initialized, setInitialized] = useState(false);

    const fetchProcesses = useCallback(async (params: ProcessesListParams, append = false) => {
        setLoading(true);
        setError(null);

        try {
            const response: ProcessesListResponse = await processesApi.list(params);

            if (append) {
                setProcesses((prev) => [...prev, ...response.data]);
            } else {
                setProcesses(response.data);
            }

            setHasMore(response.hasMore);
            setNextCursor(response.nextCursor);
        } catch (err) {
            setError(err as ApiError);
            if (!append) {
                setProcesses([]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && nextCursor && currentParams) {
            fetchProcesses({ ...currentParams, cursor: nextCursor }, true);
        }
    }, [loading, hasMore, nextCursor, currentParams, fetchProcesses]);

    const refetch = useCallback((params?: ProcessesListParams) => {
        const newParams = params || currentParams || {};
        setCurrentParams(newParams);
        fetchProcesses(newParams, false);
    }, [currentParams, fetchProcesses]);

    const reset = useCallback(() => {
        setProcesses([]);
        setError(null);
        setHasMore(false);
        setNextCursor(undefined);
        setCurrentParams(initialParams);
        setInitialized(false);
    }, [initialParams]);

    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            const paramsToUse = initialParams ?? {};
            setCurrentParams(paramsToUse);
            fetchProcesses(paramsToUse, false);
        }
    }, [initialParams, initialized, fetchProcesses]);

    return {
        processes,
        loading,
        error,
        hasMore,
        nextCursor,
        loadMore,
        refetch,
        reset,
    };
};
