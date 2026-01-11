import { apiClient, handleApiError } from '@/shared/api/client';
import type {
    Process,
    ProcessesListParams,
    ProcessesListResponse,
} from '../types';

/**
 * API Client for legal processes
 * All calls must follow the contract defined in Swagger
 */

export const processesApi = {
    /**
     * List processes with filters and cursor-based pagination
     */
    async list(params: ProcessesListParams = {}): Promise<ProcessesListResponse> {
        try {
            const response = await apiClient.get<ProcessesListResponse>('/processos', {
                params: {
                    search: params.search,
                    tribunal: params.tribunal,
                    grau: params.grau,
                    cursor: params.cursor,
                    limit: params.limit || 20,
                },
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get a specific process by ID
     */
    async getById(id: string): Promise<Process> {
        try {
            const response = await apiClient.get<Process>(`/processos/${id}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get available court options (for filters)
     */
    async getTribunais(): Promise<string[]> {
        try {
            const response = await apiClient.get<string[]>('/processos/tribunais');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
