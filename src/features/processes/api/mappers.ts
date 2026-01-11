/**
 * Mappers to convert API response to frontend types
 */

import type {
    ApiProcessesListResponse,
    ApiProcessListItem,
    ApiProcessDetailResponse,
    ApiParte,
    ProcessListItem,
    Process,
    ProcessesListResponse,
    SimplifiedParte,
} from '../types';

/**
 * Maps grauAtual (G1/G2) to frontend format (PRIMEIRO/SEGUNDO)
 */
const mapGrau = (grauAtual: 'G1' | 'G2'): 'PRIMEIRO' | 'SEGUNDO' => {
    return grauAtual === 'G1' ? 'PRIMEIRO' : 'SEGUNDO';
};

/**
 * Maps API list item to ProcessListItem
 */
export const mapApiItemToListItem = (item: ApiProcessListItem, index: number): ProcessListItem => {
    return {
        id: `${item.numeroProcesso}-${index}`,
        numero: item.numeroProcesso,
        tribunal: item.siglaTribunal,
        grau: mapGrau(item.grauAtual),
        classePrincipal: item.classePrincipal,
        assuntoPrincipal: item.assuntoPrincipal,
        ultimoMovimento: {
            data: item.ultimoMovimento.dataHora,
            descricao: item.ultimoMovimento.descricao,
        },
    };
};

/**
 * Maps API list response to frontend list response
 */
export const mapProcessesListResponse = (
    apiResponse: ApiProcessesListResponse
): ProcessesListResponse => {
    const data = apiResponse.items.map((item, index) => mapApiItemToListItem(item, index));

    return {
        data,
        nextCursor: apiResponse.nextCursor,
        hasMore: !!apiResponse.nextCursor,
    };
};

/**
 * Maps API parte to SimplifiedParte
 */
const mapApiParte = (parte: ApiParte, index: number): SimplifiedParte => {
    return {
        id: `${parte.polo}-${index}-${parte.nome}`,
        nome: parte.nome,
        tipo: parte.polo === 'ativo' ? 'ATIVO' : parte.polo === 'passivo' ? 'PASSIVO' : 'ATIVO',
    };
};

/**
 * Maps API detail response to Process
 */
export const mapApiDetailToProcess = (apiResponse: ApiProcessDetailResponse): Process => {
    const ultimoMovimento = {
        id: `movimento-${apiResponse.numeroProcesso}-${apiResponse.ultimoMovimento.codigo}`,
        data: apiResponse.ultimoMovimento.data,
        descricao: apiResponse.ultimoMovimento.descricao,
        tipo: apiResponse.ultimoMovimento.codigo,
    };

    return {
        id: apiResponse.numeroProcesso,
        numero: apiResponse.numeroProcesso,
        tribunal: apiResponse.siglaTribunal,
        grau: mapGrau(apiResponse.tramitacaoAtual.grau),
        classePrincipal: apiResponse.tramitacaoAtual.classes[0] || '',
        assuntoPrincipal: apiResponse.tramitacaoAtual.assuntos[0] || '',
        ultimoMovimento,
        movimentos: [ultimoMovimento], // Only last movement available in current response
        partes: apiResponse.partes.map((parte, index) => mapApiParte(parte, index)),
        tramitacaoAtual: {
            id: `tramitacao-${apiResponse.numeroProcesso}`,
            local: apiResponse.tramitacaoAtual.orgaoJulgador,
            status: 'EM_TRAMITACAO',
            data: apiResponse.tramitacaoAtual.dataDistribuicao,
        },
    };
};
