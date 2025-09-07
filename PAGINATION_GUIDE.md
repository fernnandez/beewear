# Guia de Paginação e Filtragem

Este documento explica como usar o sistema de paginação e filtragem implementado na aplicação BeeWear.

## Visão Geral

O sistema de paginação foi implementado de forma padronizada tanto no backend (API) quanto no frontend (Store-Front), permitindo:

- **Paginação**: Navegação entre páginas com controle de limite de itens
- **Filtros**: Filtros específicos para cada tipo de listagem
- **Ordenação**: Ordenação por diferentes campos
- **Busca**: Busca textual em campos relevantes

## Backend (API)

### DTOs Padronizados

#### PaginationDto
```typescript
{
  page?: number;        // Página atual (padrão: 1)
  limit?: number;       // Itens por página (padrão: 10, máx: 100)
  sortBy?: string;      // Campo para ordenação
  sortOrder?: 'ASC' | 'DESC'; // Direção da ordenação (padrão: DESC)
}
```

#### PaginatedResponseDto
```typescript
{
  data: T[];           // Dados da página atual
  total: number;       // Total de itens
  page: number;        // Página atual
  limit: number;       // Itens por página
  totalPages: number;  // Total de páginas
  hasPrevious: boolean; // Tem página anterior
  hasNext: boolean;    // Tem próxima página
}
```

### Filtros Específicos

#### ProductFilterDto
- `search`: Busca por nome do produto
- `active`: Filtrar por status ativo/inativo
- `collectionId`: Filtrar por coleção
- `minPrice`/`maxPrice`: Faixa de preço
- `colors`: Array de cores
- `sizes`: Array de tamanhos
- `startDate`/`endDate`: Filtro por data de criação

#### OrderFilterDto
- `search`: Busca por ID do pedido
- `status`: Status do pedido
- `paymentStatus`: Status do pagamento
- `paymentMethod`: Método de pagamento
- `startDate`/`endDate`: Filtro por data de criação

### Endpoints Disponíveis

#### Produtos
- `GET /public/product` - Lista simples (sem paginação)
- `GET /public/product/paginated` - Lista com paginação e filtros (ordenada por data de criação - mais recentes primeiro)

#### Pedidos
- `GET /orders/my-orders` - Lista do usuário (sem paginação)
- `GET /orders` - Lista simples (admin)

### Exemplo de Uso

```bash
# Buscar produtos com paginação e filtros
GET /public/product/paginated?page=1&limit=20&search=camiseta&active=true&collectionId=abc123

# Buscar pedidos do usuário (sem paginação)
GET /orders/my-orders
```

## Frontend (Store-Front)

### Hooks Customizados

#### usePagination
Hook genérico para gerenciar estado de paginação:

```typescript
const {
  pagination,           // Parâmetros de paginação
  filters,             // Filtros aplicados
  updatePagination,    // Atualizar paginação
  updateFilters,       // Atualizar filtros
  resetFilters,        // Limpar filtros
  goToPage,           // Ir para página específica
  nextPage,           // Próxima página
  previousPage,       // Página anterior
  paginationInfo,     // Informações da paginação
} = usePagination(options);
```

#### useProductsPaginated
Hook específico para produtos:

```typescript
const {
  data,               // Dados paginados
  isLoading,          // Estado de carregamento
  error,              // Erro se houver
  pagination,         // Controles de paginação
  filters,            // Controles de filtros
  // ... outros métodos
} = useProductsPaginated({
  initialLimit: 12,
});
```


### Componentes Reutilizáveis

#### Pagination
Componente para controles de paginação:

```tsx
<Pagination
  paginationInfo={paginationInfo}
  onPageChange={goToPage}
  onLimitChange={(limit) => updatePagination({ limit, page: 1 })}
  showLimitSelector={true}
  showInfo={true}
/>
```

#### FilterBar
Componente para barra de filtros:

```tsx
<FilterBar
  filters={filters}
  onFiltersChange={updateFilters}
  onReset={resetFilters}
  searchPlaceholder="Buscar produtos..."
>
  <PriceRangeFilter
    minPrice={filters.minPrice}
    maxPrice={filters.maxPrice}
    onMinPriceChange={(value) => updateFilters({ minPrice: Number(value) || undefined })}
    onMaxPriceChange={(value) => updateFilters({ maxPrice: Number(value) || undefined })}
  />
  
  <StatusFilter
    value={filters.active?.toString()}
    onChange={(value) => updateFilters({ active: value === 'true' ? true : value === 'false' ? false : undefined })}
    label="Status"
    data={[
      { value: 'true', label: 'Ativo' },
      { value: 'false', label: 'Inativo' },
    ]}
  />
</FilterBar>
```

### Tipos TypeScript

#### PaginationParams
```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
```

#### PaginatedResponse
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

#### Filtros
```typescript
interface ProductFilters extends BaseFilters {
  collectionId?: string;
  minPrice?: number;
  maxPrice?: number;
  colors?: string[];
  sizes?: string[];
}

interface OrderFilters extends BaseFilters {
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}
```

## Como Adicionar Paginação a Novas Listagens

### 1. Backend

1. **Criar DTOs de filtro** específicos para sua entidade
2. **Atualizar o serviço** com método `findAllPaginated`
3. **Atualizar o controller** com endpoint `/paginated`
4. **Usar QueryBuilder** para aplicar filtros e paginação

### 2. Frontend

1. **Criar tipos** para filtros específicos
2. **Atualizar o serviço** com método paginado
3. **Criar hook customizado** usando `usePagination`
4. **Atualizar o componente** para usar o hook e componentes de UI

### Exemplo de Implementação

```typescript
// 1. Criar filtros específicos
interface MyEntityFilters extends BaseFilters {
  customField?: string;
  anotherField?: number;
}

// 2. Atualizar serviço
async getMyEntitiesPaginated(
  pagination: PaginationParams = {},
  filters: MyEntityFilters = {}
): Promise<PaginatedResponse<MyEntity>> {
  // Implementar lógica de paginação
}

// 3. Criar hook
export const useMyEntitiesPaginated = (options) => {
  const pagination = usePagination<MyEntityFilters>(options);
  const query = useQuery({
    queryKey: ["my-entities-paginated", pagination.pagination, pagination.filters],
    queryFn: () => myEntityService.getMyEntitiesPaginated(pagination.pagination, pagination.filters),
  });
  
  return { ...query, ...pagination };
};

// 4. Usar no componente
const { data, pagination, filters, updateFilters, goToPage, paginationInfo } = useMyEntitiesPaginated();
```

## Benefícios

- **Performance**: Carregamento mais rápido com menos dados por requisição
- **UX**: Melhor experiência do usuário com controles intuitivos
- **Escalabilidade**: Suporta grandes volumes de dados
- **Flexibilidade**: Filtros e ordenação personalizáveis
- **Padronização**: Implementação consistente em toda aplicação
- **Reutilização**: Componentes e hooks reutilizáveis
