# SBK - Frontend de Processos Jurídicos

Aplicação frontend React desenvolvida com Vite, TypeScript e Material UI para consumo de API REST de processos jurídicos desenvolvida em NestJS.

## 🏗️ Arquitetura

O projeto segue uma arquitetura baseada em features, priorizando separação de responsabilidades, tipagem forte e código limpo.

### Estrutura de Diretórios

```
src/
├── features/                    # Funcionalidades específicas do domínio
│   └── processes/
│       ├── api/                # Cliente API específico da feature
│       ├── hooks/              # Hooks customizados para data fetching
│       ├── components/         # Componentes específicos da feature
│       ├── pages/              # Páginas/rotas da feature
│       └── types/              # Tipos/interfaces específicos da feature
│
├── shared/                      # Código compartilhado entre features
│   ├── api/                    # Cliente API base e utilitários
│   ├── components/             # Componentes reutilizáveis (Loading, Error, Empty)
│   ├── hooks/                  # Hooks compartilhados (se necessário)
│   └── theme/                  # Configuração do Material UI Theme
│
├── App.tsx                     # Componente raiz e configuração de rotas
└── main.tsx                    # Ponto de entrada da aplicação
```

## 🎯 Decisões Técnicas

### 1. **Feature-Based Architecture**

A organização baseada em features permite:
- **Isolamento de responsabilidades**: Cada feature é auto-contida
- **Escalabilidade**: Fácil adicionar novas features sem impactar existentes
- **Manutenibilidade**: Fácil localizar e modificar código relacionado
- **Colocação**: Código relacionado fica próximo (api, hooks, components, types)

### 2. **Tipagem Forte Baseada em Contratos**

Todos os tipos em `features/processes/types/index.ts` refletem os DTOs da API:
- Garante type-safety em tempo de compilação
- Facilita refatorações
- Documenta implicitamente os contratos da API
- Previne erros de runtime relacionados a tipos

**IMPORTANTE**: Os tipos devem ser atualizados sempre que o contrato Swagger/OpenAPI da API mudar.

### 3. **Hooks Customizados para Data Fetching**

**`useProcesses`** (listagem):
- Gerencia estado de loading, error e dados
- Implementa paginação baseada em cursor
- Permite filtros e busca
- Suporta "carregar mais" (append)

**`useProcesso`** (detalhe):
- Fetching de processo individual
- Retry automático via `refetch`
- Estado isolado por ID

**Benefícios**:
- Lógica de data fetching reutilizável
- Componentes de apresentação sem lógica de negócio
- Fácil testar isoladamente
- Consistência de tratamento de erros

### 4. **API Client Centralizado**

**`shared/api/client.ts`**:
- Instância Axios configurada centralmente
- Base URL via variável de ambiente
- Função utilitária `handleApiError` para tratamento consistente de erros
- Facilita interceptors futuros (auth, logging, etc.)

**`features/processes/api/processesApi.ts`**:
- Encapsula todas as chamadas de API relacionadas a processos
- Apenas responsável por fazer requisições HTTP
- Não contém lógica de negócio
- Tipado com interfaces da feature

### 5. **Tratamento Explícito de Estados**

**Componentes Compartilhados**:
- `LoadingSpinner`: Estado de carregamento
- `ErrorState`: Erros da API com opção de retry
- `EmptyState`: Estado vazio com mensagem descritiva

**Aplicação consistente**:
- Todas as páginas tratam explicitamente loading, error e empty
- UX clara para o usuário
- Fácil debug

### 6. **Material UI para UI**

**Decisões**:
- Theme centralizado em `shared/theme`
- Componentes do MUI para consistência visual
- Layout responsivo com Grid system
- Feedback visual simples e profissional

### 7. **Variáveis de Ambiente**

**`.env`**:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

- Base URL configurável por ambiente
- Segue convenção do Vite (`VITE_*`)
- `.env.example` documenta variáveis necessárias

### 8. **React Router para Navegação**

- Rotas definidas em `App.tsx`
- Navegação declarativa
- URLs semânticas: `/processos` e `/processos/:id`

## 📋 Funcionalidades Implementadas

### 1. Listagem de Processos

- ✅ Campo de busca textual
- ✅ Filtros por tribunal e grau
- ✅ Exibição em lista (cards)
- ✅ Campos: número, tribunal, grau, classe principal, assunto principal, último movimento
- ✅ Paginação baseada em cursor ("Carregar mais")
- ✅ Estados: loading, error, empty

### 2. Detalhe do Processo

- ✅ Cabeçalho completo do processo
- ✅ Partes separadas por polo (ativo / passivo)
- ✅ Destaque visual do último movimento
- ✅ Informações da tramitação atual
- ✅ Histórico completo de movimentos
- ✅ Estados: loading, error

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ e npm/yarn/pnpm

### Instalação

```bash
# Instalar dependências
npm install

# Ou
yarn install

# Ou
pnpm install
```

### Configuração

1. Crie o arquivo `.env` na raiz do projeto (copie de `env.example.txt`):

**No Windows PowerShell:**
```powershell
Copy-Item env.example.txt .env
```

**No Linux/Mac:**
```bash
cp env.example.txt .env
```

**Ou crie manualmente** um arquivo `.env` com o seguinte conteúdo:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

2. Configure a `VITE_API_BASE_URL` apontando para sua API NestJS. Exemplo:
   - Desenvolvimento local: `http://localhost:3000/api`
   - Produção: `https://api.seudominio.com/api`

**⚠️ Importante:** O arquivo `.env` não será versionado no Git (está no `.gitignore`). Cada desenvolvedor deve criar seu próprio `.env` local.

### Executar em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Preview da Build

```bash
npm run preview
```

## 📦 Tecnologias Utilizadas

- **React 18**: Biblioteca UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Material UI (MUI)**: Componentes UI
- **React Router DOM**: Roteamento
- **Axios**: Cliente HTTP
- **ESLint**: Linting

## 🔧 Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run preview`: Preview da build de produção
- `npm run lint`: Executa ESLint

## 📝 Notas Importantes

### Integração com a API

1. **Contrato Swagger**: Os tipos TypeScript devem refletir exatamente os DTOs da API. Atualize `src/features/processes/types/index.ts` sempre que o Swagger mudar.

2. **Endpoints Esperados**:
   - `GET /api/processos` - Lista processos (query params: `search`, `tribunal`, `grau`, `cursor`, `limit`)
   - `GET /api/processos/:id` - Detalhe de um processo
   - `GET /api/processos/tribunais` - Lista de tribunais disponíveis (opcional)

3. **Formato de Resposta Esperado (Lista)**:
```typescript
{
  data: ProcessoListItem[],
  nextCursor?: string,
  hasMore: boolean
}
```

### Extensibilidade Futura

A arquitetura facilita:
- Adicionar novas features (ex: `features/usuarios/`, `features/relatorios/`)
- Implementar autenticação (interceptors no `apiClient`)
- Adicionar testes unitários/integração
- Implementar cache (React Query, SWR)
- Adicionar estado global (Context API, Zustand, Redux) se necessário

## 🎨 Padrões de Código

- **Componentes**: Funcionais com hooks
- **Nomenclatura**: PascalCase para componentes, camelCase para funções
- **Tipos**: Interfaces para objetos, `type` para unions/intersections
- **Imports**: Path aliases (`@/shared/...`) para clareza
- **Exports**: Named exports preferidos

## 📚 Boas Práticas Seguidas

✅ Separação clara de responsabilidades
✅ Componentes de apresentação sem lógica de negócio
✅ Hooks para lógica reutilizável
✅ Tipagem forte em toda aplicação
✅ Tratamento explícito de estados (loading, error, empty)
✅ API client centralizado
✅ Variáveis de ambiente para configuração
✅ Código limpo e legível
✅ Estrutura escalável

## 🤝 Contribuindo

Ao adicionar novas features:
1. Crie a estrutura em `features/nova-feature/`
2. Mantenha a separação api/hooks/components/pages/types
3. Utilize componentes compartilhados quando possível
4. Adicione tipos baseados no contrato da API
5. Implemente tratamento de estados explicitamente

---

**Desenvolvido seguindo práticas de código limpo, arquitetura escalável e maturidade técnica.**
