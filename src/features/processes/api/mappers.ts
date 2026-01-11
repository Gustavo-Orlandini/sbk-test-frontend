/**
 * Mappers to convert API response to frontend types
 */

import type {
    ApiProcessesListResponse,
    ApiProcessListItem,
    ApiProcessDetailResponse,
    ApiParte,
    ApiRepresentante,
    ProcessListItem,
    Process,
    ProcessesListResponse,
    SimplifiedParte,
    Representante,
} from '../types';

/**
 * Maps grauAtual (G1/G2/SUP) to frontend format (PRIMEIRO/SEGUNDO/SUPERIOR)
 */
const mapGrau = (grauAtual: 'G1' | 'G2' | 'SUP'): 'PRIMEIRO' | 'SEGUNDO' | 'SUPERIOR' => {
    if (grauAtual === 'G1') return 'PRIMEIRO';
    if (grauAtual === 'G2') return 'SEGUNDO';
    return 'SUPERIOR';
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
 * Maps API representante to Representante
 */
const mapApiRepresentante = (representante: ApiRepresentante, index: number): Representante => {
    return {
        id: `representante-${index}-${representante.nome}`,
        nome: representante.nome,
        tipo: representante.tipo,
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
        tipoParte: parte.tipoParte,
        representantes: parte.representantes.map((rep, repIndex) => mapApiRepresentante(rep, repIndex)),
    };
};

/**
 * Maps API detail response to Process
 */
export const mapApiDetailToProcess = (apiResponse: ApiProcessDetailResponse): Process => {
    const ultimoMovimento = {
        id: `movimento-${apiResponse.numeroProcesso}-${apiResponse.ultimoMovimento.codigo || 'last'}`,
        data: apiResponse.ultimoMovimento.data,
        descricao: apiResponse.ultimoMovimento.descricao,
        tipo: apiResponse.ultimoMovimento.codigo || '',
        orgaoJulgador: apiResponse.ultimoMovimento.orgaoJulgador,
        codigo: apiResponse.ultimoMovimento.codigo,
    };

    return {
        id: apiResponse.numeroProcesso,
        numero: apiResponse.numeroProcesso,
        tribunal: apiResponse.siglaTribunal,
        nivelSigilo: apiResponse.nivelSigilo,
        grau: mapGrau(apiResponse.tramitacaoAtual.grau),
        classes: apiResponse.tramitacaoAtual.classes || [],
        assuntos: apiResponse.tramitacaoAtual.assuntos || [],
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
            dataAutuacao: apiResponse.tramitacaoAtual.dataAutuacao,
        },
        dataDistribuicao: apiResponse.tramitacaoAtual.dataDistribuicao,
        dataAutuacao: apiResponse.tramitacaoAtual.dataAutuacao,
    };
};
