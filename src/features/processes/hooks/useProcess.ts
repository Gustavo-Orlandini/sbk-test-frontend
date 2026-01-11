import { useState, useEffect, useCallback, useRef } from 'react';
import { processesApi } from '../api/processesApi';
import type { Process } from '../types';
import type { ApiError } from '@/shared/api/client';
import { useToast } from '@/shared/hooks/useToast';

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
    const { showError, showSuccess } = useToast();
    const toastRef = useRef({ showError, showSuccess });

    // Keep toast refs updated
    useEffect(() => {
        toastRef.current = { showError, showSuccess };
    }, [showError, showSuccess]);

    const fetchProcess = useCallback(async (silent = false) => {
        if (!id) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await processesApi.getByCaseNumber(id);
            setProcess(data);
            // Only show success toast if not silent (e.g., on manual refetch)
            if (!silent) {
                toastRef.current.showSuccess('Processo carregado com sucesso');
            }
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError);
            toastRef.current.showError(apiError.message || 'Erro ao carregar processo');
            setProcess(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // Silent initial load - no toast on first render
        fetchProcess(true);
    }, [fetchProcess]);

    const refetch = useCallback(() => {
        // Manual refetch should show toast
        fetchProcess(false);
    }, [fetchProcess]);

    return {
        process,
        loading,
        error,
        refetch,
    };
};
