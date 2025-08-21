# 📚 Documentação do Sistema BeeWear

## 🎯 Visão Geral

O **BeeWear** é um sistema completo de e-commerce desenvolvido para gerenciar produtos de vestuário, com funcionalidades avançadas de gestão de estoque, processamento de pedidos e pagamentos online. O sistema é composto por uma API backend robusta e duas aplicações frontend: uma para gestão administrativa e outra para vendas online.

---

## 🏗️ Arquitetura do Sistema

### **Backend (API)**
- **Framework**: NestJS (Node.js)
- **Banco de Dados**: PostgreSQL com TypeORM
- **Autenticação**: JWT com sistema de roles
- **Pagamentos**: Integração com Stripe
- **Armazenamento**: Cloudinary para imagens
- **Documentação**: Swagger/OpenAPI

### **Frontend**
- **Store Front**: React + TypeScript + Mantine UI (Vendas)
- **Stock Front**: React + TypeScript + Mantine UI (Administração)
- **Estado**: React Query para cache e sincronização
- **Roteamento**: React Router

---

## 🔐 Módulo de Autenticação e Usuários

### **Funcionalidades de Usuário**
- ✅ **Registro de usuários** com validação de email único
- ✅ **Login seguro** com hash de senha (bcrypt)
- ✅ **Sistema de roles** (USER, ADMIN)
- ✅ **Autenticação JWT** com expiração configurável
- ✅ **Middleware de proteção** para rotas privadas
- ✅ **Decoradores personalizados** para controle de acesso

### **Endpoints de Autenticação**
```
POST /auth/register - Registro de usuário
POST /auth/login - Login de usuário
GET /auth/me - Perfil do usuário autenticado
```

### **Gestão de Endereços**
- ✅ **CRUD completo** de endereços por usuário
- ✅ **Validação de campos** obrigatórios
- ✅ **Suporte a múltiplos endereços** por usuário
- ✅ **Integração com checkout** para seleção de endereço

### **Endpoints de Endereços**
```
POST /addresses - Criar endereço
GET /addresses - Listar endereços do usuário
PUT /addresses/:id - Atualizar endereço
DELETE /addresses/:id - Remover endereço
```

---

## 🛍️ Módulo de Produtos e Catálogo

### **Gestão de Produtos**
- ✅ **CRUD completo** de produtos
- ✅ **Sistema de coleções** para organização
- ✅ **Variações de produto** (cor, tamanho, preço)
- ✅ **Gestão de imagens** com upload para Cloudinary
- ✅ **Controle de status** (ativo/inativo)
- ✅ **Validação de dados** com class-validator

### **Endpoints de Produtos (Admin)**
```
POST /product - Criar produto
GET /product - Listar todos os produtos
GET /product/:publicId - Buscar produto específico
PATCH /product/:publicId - Atualizar produto
DELETE /product/:publicId - Remover produto
```

### **Endpoints Públicos (Store Front)**
```
GET /public/product - Listar produtos ativos
GET /public/product/:publicId - Detalhes do produto
GET /public/collection - Listar coleções
```

### **Sistema de Variações**
- ✅ **Criação automática** de variações por tamanho
- ✅ **Gestão de cores** e preços por variação
- ✅ **Upload múltiplo** de imagens por variação
- ✅ **Validação de dados** e tratamento de erros

### **Endpoints de Variações**
```
POST /product-variation/:productPublicId - Criar variação
PATCH /product-variation/:publicId - Atualizar variação
PATCH /product-variation/:publicId/images - Adicionar imagens
DELETE /product-variation/:publicId - Remover variação
```

---

## 📦 Módulo de Gestão de Estoque

### **Funcionalidades de Estoque**
- ✅ **Controle de quantidade** por variação de produto
- ✅ **Movimentações automáticas** (entrada/saída)
- ✅ **Histórico completo** de movimentações
- ✅ **Validação de estoque** antes de vendas
- ✅ **Dashboard de estoque** com alertas
- ✅ **Ajustes manuais** de estoque

### **Endpoints de Estoque**
```
POST /stock/:stockItemPublicId/adjust - Ajustar estoque
GET /stock/:stockItemPublicId/movements - Histórico de movimentos
GET /product/dashboard/stock - Dashboard de estoque
```

### **Tipos de Movimentação**
- **IN**: Entrada de estoque (compra, ajuste positivo)
- **OUT**: Saída de estoque (venda, ajuste negativo)

### **Dashboard de Estoque**
- **Total de produtos** em estoque
- **Valor total** do estoque
- **Alertas de estoque baixo** (configurável)
- **Produtos sem estoque**
- **Movimentos recentes**

---

## 🛒 Módulo de Pedidos e Checkout

### **Sistema de Pedidos**
- ✅ **Criação automática** após pagamento confirmado
- ✅ **Validação de estoque** antes da criação
- ✅ **Atualização automática** de estoque
- ✅ **Rastreamento de status** do pedido
- ✅ **Histórico de pedidos** por usuário
- ✅ **Gestão de status** por administradores

### **Fluxo de Checkout**
1. **Validação de estoque** antes do checkout
2. **Criação de sessão** Stripe
3. **Redirecionamento** para checkout Stripe
4. **Verificação de pagamento** após retorno
5. **Criação automática** do pedido
6. **Atualização de estoque**

### **Endpoints de Pedidos**
```
POST /orders/validate-stock - Validar estoque
GET /orders/my-orders - Pedidos do usuário
GET /orders/:publicId - Detalhes do pedido
PUT /orders/:publicId/status - Atualizar status (ADMIN)
```

### **Status dos Pedidos**
- **PENDING**: Aguardando pagamento
- **CONFIRMED**: Pagamento confirmado
- **PROCESSING**: Em preparação
- **SHIPPED**: Enviado
- **DELIVERED**: Entregue
- **CANCELLED**: Cancelado

---

## 💳 Módulo de Pagamentos

### **Integração Stripe**
- ✅ **Checkout Sessions** para pagamentos
- ✅ **Suporte a múltiplos métodos** de pagamento
- ✅ **Processamento automático** de pagamentos
- ✅ **Webhooks** para atualizações em tempo real
- ✅ **Metadados personalizados** para rastreamento
- ✅ **Suporte a moedas** (EUR para Portugal)

### **Endpoints de Pagamento**
```
POST /payments/checkout - Criar sessão de checkout
GET /payments/verify-payment/:sessionId - Verificar status
```

### **Métodos de Pagamento Suportados**
- **Cartão de Crédito/Débito**
- **Klarna** (pagamento em parcelas)
- **PIX** (pagamento instantâneo)
- **Transferência Bancária**

---

## 📤 Módulo de Upload e Armazenamento

### **Sistema de Upload**
- ✅ **Upload de imagens** com validação
- ✅ **Armazenamento Cloudinary** para produção
- ✅ **Armazenamento local** para desenvolvimento
- ✅ **Limite de tamanho** configurável (5MB)
- ✅ **Validação de tipos** de arquivo
- ✅ **Geração automática** de URLs seguras

### **Endpoints de Upload**
```
POST /upload - Upload de arquivo
GET /upload/:filename - Servir imagem
```

### **Funcionalidades**
- **Compressão automática** de imagens
- **Organização por pastas** no Cloudinary
- **URLs seguras** (HTTPS)
- **Fallback** para armazenamento local

---

## 🎨 Módulo de Coleções

### **Gestão de Coleções**
- ✅ **CRUD completo** de coleções
- ✅ **Organização de produtos** por coleção
- ✅ **Upload de imagens** para coleções
- ✅ **Controle de status** (ativo/inativo)
- ✅ **Validação de dados** e relacionamentos

### **Endpoints de Coleções**
```
POST /collection - Criar coleção
GET /collection - Listar coleções
GET /collection/:publicId - Buscar coleção
PATCH /collection/:publicId - Atualizar coleção
DELETE /collection/:publicId - Remover coleção
PATCH /collection/:publicId/image - Atualizar imagem
```

---

## 🔍 Funcionalidades de Busca e Filtros

### **Sistema de Busca**
- ✅ **Filtros por coleção** de produtos
- ✅ **Busca por nome** de produto
- ✅ **Filtros por status** (ativo/inativo)
- ✅ **Ordenação** por data, nome, preço
- ✅ **Paginação** de resultados

### **Otimizações**
- **Queries otimizadas** com TypeORM
- **Relacionamentos lazy** para performance
- **Cache de consultas** frequentes
- **Índices de banco** para busca rápida

---

## 📊 Dashboard e Relatórios

### **Dashboard de Estoque**
- **Visão geral** do inventário
- **Alertas de estoque** baixo
- **Movimentos recentes** de estoque
- **Produtos mais vendidos**
- **Valor total** do estoque

### **Relatórios de Vendas**
- **Histórico de pedidos** por período
- **Status dos pedidos** em tempo real
- **Produtos mais populares**
- **Análise de vendas** por coleção

---

## 🛡️ Segurança e Validação

### **Autenticação e Autorização**
- **JWT tokens** com expiração configurável
- **Hash de senhas** com bcrypt
- **Middleware de proteção** para rotas privadas
- **Sistema de roles** para controle de acesso
- **Validação de tokens** em todas as requisições

### **Validação de Dados**
- **Class-validator** para validação de DTOs
- **Sanitização** de inputs
- **Validação de tipos** e formatos
- **Tratamento de erros** padronizado

### **CORS e Segurança**
- **Configuração CORS** personalizada
- **Rate limiting** configurável
- **Headers de segurança** automáticos
- **Validação de origens** permitidas

---

## 🧪 Testes e Qualidade

### **Estrutura de Testes**
- **Testes unitários** para serviços
- **Testes de integração** para APIs
- **Testes E2E** para fluxos completos
- **Mocks e fixtures** para dados de teste
- **Cobertura de código** configurável

### **Tipos de Teste**
- **Unit Tests**: Lógica de negócio isolada
- **Integration Tests**: APIs e banco de dados
- **E2E Tests**: Fluxos completos de usuário

---

## 🚀 Deploy e Infraestrutura

### **Configuração de Ambiente**
- **Variáveis de ambiente** configuráveis
- **Configurações por ambiente** (dev, test, prod)
- **Docker** para containerização
- **Docker Compose** para desenvolvimento local

### **Banco de Dados**
- **PostgreSQL** como banco principal
- **Migrations** automáticas
- **Seeds** para dados iniciais
- **Backup** e recuperação configuráveis

### **Monitoramento**
- **Logs estruturados** com timestamps
- **Métricas de performance** configuráveis
- **Alertas** para erros críticos
- **Health checks** para endpoints

---

## 📱 Aplicações Frontend

### **Store Front (Vendas)**
- **Catálogo de produtos** responsivo
- **Sistema de carrinho** persistente
- **Checkout integrado** com Stripe
- **Gestão de conta** e endereços
- **Histórico de pedidos** do usuário
- **Validação de estoque** em tempo real

### **Stock Front (Administração)**
- **Dashboard de estoque** completo
- **Gestão de produtos** e variações
- **Upload de imagens** drag & drop
- **Controle de coleções** e categorias
- **Gestão de pedidos** e status
- **Relatórios** e métricas

---

## 🔧 Tecnologias e Dependências

### **Backend**
- **NestJS**: Framework principal
- **TypeORM**: ORM para banco de dados
- **PostgreSQL**: Banco de dados
- **JWT**: Autenticação
- **Stripe**: Pagamentos
- **Cloudinary**: Armazenamento de imagens

### **Frontend**
- **React**: Framework principal
- **TypeScript**: Tipagem estática
- **Mantine UI**: Componentes de interface
- **React Query**: Gerenciamento de estado
- **React Router**: Roteamento
- **Axios**: Cliente HTTP

### **Ferramentas de Desenvolvimento**
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Jest**: Framework de testes
- **Swagger**: Documentação de API
- **Docker**: Containerização

---

## 📋 Checklist de Funcionalidades

### **✅ Implementado**
- [x] Sistema de autenticação JWT
- [x] Gestão de usuários e endereços
- [x] CRUD completo de produtos
- [x] Sistema de variações e estoque
- [x] Gestão de coleções
- [x] Upload e armazenamento de imagens
- [x] Sistema de pedidos e checkout
- [x] Integração com Stripe
- [x] Validação de estoque
- [x] Dashboard administrativo
- [x] API pública para frontend
- [x] Sistema de roles e permissões
- [x] Testes automatizados
- [x] Documentação Swagger

### **🔄 Em Desenvolvimento**
- [ ] Webhooks Stripe para atualizações automáticas
- [ ] Sistema de notificações por email
- [ ] Relatórios avançados de vendas
- [ ] Sistema de cupons e descontos
- [ ] Integração com sistemas de frete

### **📝 Planejado**
- [ ] Sistema de avaliações de produtos
- [ ] Wishlist de produtos
- [ ] Sistema de afiliados
- [ ] Integração com redes sociais
- [ ] App mobile nativo

---

## 📞 Suporte e Contato

### **Documentação Técnica**
- **Swagger**: `/api` - Documentação interativa da API
- **README**: Instruções de instalação e configuração
- **Testes**: Exemplos de uso e casos de teste

### **Configuração**
- **Arquivo .env**: Configurações de ambiente
- **Docker Compose**: Configuração de desenvolvimento
- **Scripts**: Comandos para setup e deploy

---

## 🎉 Conclusão

O sistema BeeWear representa uma solução completa e robusta para e-commerce, com funcionalidades avançadas de gestão de produtos, estoque e vendas. A arquitetura modular e escalável permite fácil manutenção e expansão de funcionalidades.

O sistema está pronto para produção e inclui todas as funcionalidades essenciais para operar um negócio online de vestuário, desde a gestão de produtos até o processamento de pagamentos e controle de estoque.

---

*Documentação gerada automaticamente - Sistema BeeWear v1.0*
