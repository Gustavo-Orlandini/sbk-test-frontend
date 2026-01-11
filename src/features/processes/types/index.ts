/**
 * Types based on API DTOs
 * These types must reflect exactly the contracts defined in Swagger/OpenAPI
 * The backend already transforms the data, so these are the final DTOs
 */

// Raw API response types
export interface ApiProcessesListResponse {
    items: ApiProcessListItem[];
    nextCursor?: string;
}

export interface ApiProcessListItem {
    numeroProcesso: string;
    siglaTribunal: string;
    grauAtual: 'G1' | 'G2';
    classePrincipal: string;
    assuntoPrincipal: string;
    ultimoMovimento: {
        dataHora: string;
        descricao: string;
        orgaoJulgador: string;
    };
    partesResumo: {
        ativo: string[];
        passivo: string[];
    };
}

export interface ApiProcessDetailResponse {
    numeroProcesso: string;
    siglaTribunal: string;
    nivelSigilo: number;
    tramitacaoAtual: {
        grau: 'G1' | 'G2';
        orgaoJulgador: string;
        classes: string[];
        assuntos: string[];
        dataDistribuicao: string;
        dataAutuacao: string;
    };
    partes: ApiParte[];
    ultimoMovimento: {
        data: string;
        descricao: string;
        orgaoJulgador: string;
        codigo: string;
    };
}

export interface ApiParte {
    nome: string;
    polo: 'ativo' | 'passivo' | 'outros_participantes';
    tipoParte: string;
    representantes: ApiRepresentante[];
}

export interface ApiRepresentante {
    nome: string;
    tipo: string;
}

// Frontend types (simplified for UI)
export interface Movimento {
    id: string;
    data: string;
    descricao: string;
    tipo: string;
}

export interface Tramitacao {
    id: string;
    local: string;
    status: string;
    data?: string;
}

export interface Process {
    id: string;
    numero: string;
    tribunal: string;
    grau: 'PRIMEIRO' | 'SEGUNDO';
    classePrincipal: string;
    assuntoPrincipal: string;
    ultimoMovimento: Movimento;
    movimentos: Movimento[];
    partes: SimplifiedParte[];
    tramitacaoAtual: Tramitacao;
}

export interface SimplifiedParte {
    id: string;
    nome: string;
    tipo: 'ATIVO' | 'PASSIVO';
    documento?: string;
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
    q?: string; // Textual search (number, parties, class, subject)
    tribunal?: string;
    grau?: 'PRIMEIRO' | 'SEGUNDO';
    cursor?: string;
    limit?: number;
}

// Frontend response structure (after mapping)
export interface ProcessesListResponse {
    data: ProcessListItem[];
    nextCursor?: string;
    hasMore: boolean;
}

export interface TribunalOption {
    value: string;
    label: string;
}
