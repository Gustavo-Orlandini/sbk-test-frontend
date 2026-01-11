/**
 * Types based on API DTOs
 * These types must reflect exactly the contracts defined in Swagger/OpenAPI
 */

export interface Process {
    id: string;
    numero: string;
    tribunal: string;
    grau: 'PRIMEIRO' | 'SEGUNDO';
    classePrincipal: string;
    assuntoPrincipal: string;
    ultimoMovimento: Movimento;
    movimentos: Movimento[];
    partes: Parte[];
    tramitacaoAtual: Tramitacao;
}

export interface Movimento {
    id: string;
    data: string;
    descricao: string;
    tipo: string;
}

export interface Parte {
    id: string;
    nome: string;
    tipo: 'ATIVO' | 'PASSIVO';
    documento?: string;
}

export interface Tramitacao {
    id: string;
    local: string;
    status: string;
    data?: string;
}

export interface ProcessListItem {
    id: string;
    numero: string;
    tribunal: string;
    grau: 'PRIMEIRO' | 'SEGUNDO';
    classePrincipal: string;
    assuntoPrincipal: string;
    ultimoMovimento: {
        data: string;
        descricao: string;
    };
}

export interface ProcessesListParams {
    search?: string;
    tribunal?: string;
    grau?: 'PRIMEIRO' | 'SEGUNDO';
    cursor?: string;
    limit?: number;
}

export interface ProcessesListResponse {
    data: ProcessListItem[];
    nextCursor?: string;
    hasMore: boolean;
}

export interface TribunalOption {
    value: string;
    label: string;
}
