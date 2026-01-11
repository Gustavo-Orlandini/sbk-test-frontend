import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiError {
    message: string;
    status?: number;
    data?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            'Erro ao processar requisição';

        return {
            message: errorMessage,
            status: axiosError.response?.status,
            data: axiosError.response?.data,
        };
    }

    return {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
    };
};
