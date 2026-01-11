import { apiClient, handleApiError } from '@/shared/api/client';
import type {
    Process,
    ProcessesListParams,
    ProcessesListResponse,
    ApiProcessesListResponse,
    ApiProcessDetailResponse,
} from '../types';
import { mapProcessesListResponse, mapApiDetailToProcess } from './mappers';

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
            // Convert grau from PRIMEIRO/SEGUNDO to G1/G2 for API
            const grauApi = params.grau === 'PRIMEIRO' ? 'G1' : params.grau === 'SEGUNDO' ? 'G2' : undefined;

            const response = await apiClient.get<ApiProcessesListResponse>('/lawsuits', {
                params: {
                    search: params.search,
                    tribunal: params.tribunal,
                    grau: grauApi,
                    cursor: params.cursor,
                    limit: params.limit || 20,
                },
            });
            return mapProcessesListResponse(response.data);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get a specific process by case number
     */
    async getByCaseNumber(caseNumber: string): Promise<Process> {
        try {
            const response = await apiClient.get<ApiProcessDetailResponse>(`/lawsuits/${caseNumber}`);
            return mapApiDetailToProcess(response.data);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Get available court options (for filters)
     * TODO: Update endpoint when available in backend
     */
    async getTribunais(): Promise<string[]> {
        try {
            const response = await apiClient.get<string[]>('/lawsuits/tribunais');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
