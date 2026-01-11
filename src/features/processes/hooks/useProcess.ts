import { useState, useEffect, useCallback } from 'react';
import { processesApi } from '../api/processesApi';
import type { Process } from '../types';
import type { ApiError } from '@/shared/api/client';

interface UseProcessReturn {
    process: Process | null;
    loading: boolean;
    error: ApiError | null;
    refetch: () => void;
}

export const useProcess = (id: string | null): UseProcessReturn => {
    const [process, setProcess] = useState<Process | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchProcess = useCallback(async () => {
        if (!id) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await processesApi.getById(id);
            setProcess(data);
        } catch (err) {
            setError(err as ApiError);
            setProcess(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProcess();
    }, [fetchProcess]);

    return {
        process,
        loading,
        error,
        refetch: fetchProcess,
    };
};
