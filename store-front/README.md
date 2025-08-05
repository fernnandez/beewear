# BeeWear Store Frontend

Frontend da loja virtual BeeWear, construído com React, TypeScript e Mantine UI.

## 🚀 Tecnologias

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Mantine UI** - Biblioteca de componentes
- **React Query** - Gerenciamento de estado e cache
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- API Backend rodando (ver [API README](../api/README.md))

## 🛠️ Instalação

1. **Clone o repositório e navegue para o diretório:**
   ```bash
   cd store-front
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=BeeWear Store
   VITE_APP_VERSION=1.0.0
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── product/        # Componentes específicos de produtos
│   └── shared/         # Componentes compartilhados
├── contexts/           # Contextos React (Auth, Cart)
├── hooks/              # Hooks personalizados
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── types/              # Definições de tipos TypeScript
├── utils/              # Utilitários e constantes
└── App.tsx             # Componente principal
```

## 🔧 Funcionalidades Implementadas

### ✅ Catálogo de Produtos
- Listagem de produtos com paginação
- Filtros por coleção
- Busca de produtos
- Visualização de detalhes do produto

### ✅ Detalhes do Produto
- Galeria de imagens
- Seleção de cores e tamanhos
- Informações de estoque
- Adição ao carrinho

### ✅ Integração com API
- Busca de produtos ativos
- Busca de coleções
- Tratamento de erros
- Cache inteligente com React Query

### ✅ UX/UI
- Design responsivo
- Loading states
- Estados de erro
- Navegação intuitiva

## 🔌 Integração com API

O frontend se integra com a API através dos seguintes endpoints:

- `GET /products` - Lista produtos com filtros
- `GET /products/:publicId` - Detalhes de um produto
- `GET /collections` - Lista coleções ativas

### Configuração da API

Certifique-se de que a API esteja rodando e acessível na URL configurada em `VITE_API_URL`.

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📦 Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t beewear-store .

# Executar container
docker run -p 5173:5173 beewear-store
```

## 🔍 Debugging

### Logs de Desenvolvimento
- Abra o DevTools do navegador
- Verifique a aba Console para logs
- Use a aba Network para monitorar requisições

### React Query DevTools
- Instalado automaticamente em desenvolvimento
- Acesse para ver cache e queries

## 🚨 Troubleshooting

### Erro de Conexão com API
1. Verifique se a API está rodando
2. Confirme a URL em `VITE_API_URL`
3. Verifique CORS na API

### Erro de Build
1. Limpe o cache: `npm run clean`
2. Reinstale dependências: `rm -rf node_modules && npm install`
3. Verifique versões do Node.js

### Problemas de Tipagem
1. Execute `npm run type-check`
2. Verifique se todos os tipos estão definidos em `src/types/`

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.
